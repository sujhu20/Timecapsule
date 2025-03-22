"use client";

import { useState, useCallback, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useEncryption } from '@/lib/encryptionContext';
import { AlertCircle, Check, KeySquare, Lock, Upload } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import * as encryptionUtils from '@/lib/encryption';

export function KeySetup() {
  const { toast } = useToast();
  const { generateKeys, exportKeys, importKeys, hasKeys, isGenerating } = useEncryption();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordMismatch, setIsPasswordMismatch] = useState(false);
  const [importError, setImportError] = useState('');
  const [showRecoveryPhrase, setShowRecoveryPhrase] = useState(false);
  const [recoveryPhrase, setRecoveryPhrase] = useState('');
  const [haveBackedUp, setHaveBackedUp] = useState(false);
  
  // For key import
  const [importedKeys, setImportedKeys] = useState<File | null>(null);
  const [importPassword, setImportPassword] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleCreateKeys = async () => {
    setIsPasswordMismatch(false);
    
    // Validate password
    if (password.length < 8) {
      toast({
        title: "Password too short",
        description: "Please use at least 8 characters for your security.",
        variant: "destructive"
      });
      return;
    }
    
    // Check password match
    if (password !== confirmPassword) {
      setIsPasswordMismatch(true);
      return;
    }
    
    try {
      // Generate encryption keys protected by password
      await generateKeys(password);
      
      // Export keys to recovery phrase for backup
      const exportedRecoveryPhrase = await exportKeys(password);
      setRecoveryPhrase(exportedRecoveryPhrase);
      setShowRecoveryPhrase(true);
      
      toast({
        title: "Encryption keys created",
        description: "Please save your recovery phrase in a safe place.",
      });
    } catch (error) {
      toast({
        title: "Error creating keys",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImportedKeys(e.target.files[0]);
      setImportError('');
    }
  };
  
  const handleImportKeys = async () => {
    if (!importedKeys && !recoveryPhrase) {
      setImportError('Please upload your keys file or enter your recovery phrase');
      return;
    }
    
    if (importPassword.length < 8) {
      setImportError('Please enter the password you used to protect your keys');
      return;
    }
    
    try {
      if (importedKeys) {
        // Read file and import keys
        const reader = new FileReader();
        reader.onload = async (event) => {
          if (event.target?.result) {
            const keysData = event.target.result.toString();
            await importKeys(keysData, importPassword);
            
            toast({
              title: "Keys imported successfully",
              description: "Your encryption keys have been restored.",
            });
          }
        };
        reader.readAsText(importedKeys);
      } else if (recoveryPhrase) {
        // Import from recovery phrase
        await importKeys(recoveryPhrase, importPassword);
        
        toast({
          title: "Keys restored from recovery phrase",
          description: "Your encryption keys have been restored.",
        });
      }
    } catch (error) {
      setImportError('Failed to import keys. Check your password and try again.');
    }
  };
  
  const handleBrowseClick = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);
  
  const downloadKeysFile = () => {
    if (!recoveryPhrase) return;
    
    // Create a blob with the recovery phrase
    const blob = new Blob([recoveryPhrase], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Create a download link and click it
    const a = document.createElement('a');
    a.href = url;
    a.download = 'timecapsule_encryption_keys.txt';
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    toast({
      title: "Keys downloaded",
      description: "Keep this file in a secure location.",
    });
  };
  
  const copyRecoveryPhrase = () => {
    navigator.clipboard.writeText(recoveryPhrase);
    toast({
      title: "Recovery phrase copied",
      description: "Store this securely. You'll need it to recover your encrypted capsules.",
    });
  };
  
  if (hasKeys) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lock className="mr-2" /> Encryption Ready
          </CardTitle>
          <CardDescription>
            Your encryption keys are set up and ready to use.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Check className="h-4 w-4" />
            <AlertTitle>Your TimeCapsule content is secured</AlertTitle>
            <AlertDescription>
              End-to-end encryption is active. Your data is protected and can only be accessed by you and your intended recipients.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  
  if (showRecoveryPhrase) {
    return (
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Backup Your Encryption Keys</CardTitle>
          <CardDescription>
            This is your only chance to save your recovery phrase. If you lose it, you'll lose access to your encrypted capsules forever.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Important Security Notice</AlertTitle>
            <AlertDescription>
              Anyone with access to this recovery phrase and your password can access your encrypted content. Store it securely!
            </AlertDescription>
          </Alert>
          
          <div className="p-4 bg-muted rounded-md font-mono text-sm break-all">
            {recoveryPhrase}
          </div>
          
          <div className="flex space-x-2">
            <Button onClick={copyRecoveryPhrase} variant="outline">
              Copy to Clipboard
            </Button>
            <Button onClick={downloadKeysFile}>
              Download Key File
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="backed-up"
              checked={haveBackedUp}
              onChange={() => setHaveBackedUp(!haveBackedUp)}
            />
            <label htmlFor="backed-up">
              I have saved my recovery phrase in a safe place
            </label>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={() => setShowRecoveryPhrase(false)} 
            disabled={!haveBackedUp}
          >
            Continue
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Set Up Encryption</CardTitle>
        <CardDescription>
          TimeCapsule uses end-to-end encryption to keep your content private. No one, not even us, can access your data.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="create">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Create New Keys</TabsTrigger>
            <TabsTrigger value="import">Import Existing Keys</TabsTrigger>
          </TabsList>
          
          <TabsContent value="create" className="space-y-4">
            <Alert>
              <KeySquare className="h-4 w-4" />
              <AlertTitle>Create Your Encryption Keys</AlertTitle>
              <AlertDescription>
                You'll set a password to protect your keys. This password will be used to encrypt and decrypt your time capsules.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Input
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={isPasswordMismatch ? "border-red-500" : ""}
              />
              {isPasswordMismatch && (
                <p className="text-sm text-red-500">Passwords don't match</p>
              )}
              <Button 
                onClick={handleCreateKeys} 
                disabled={isGenerating || !password || !confirmPassword}
                className="w-full"
              >
                {isGenerating ? "Generating Keys..." : "Create Encryption Keys"}
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="import" className="space-y-4">
            <Alert>
              <Upload className="h-4 w-4" />
              <AlertTitle>Restore Your Encryption Keys</AlertTitle>
              <AlertDescription>
                If you've previously created encryption keys, you can import them using your key file or recovery phrase.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Upload Key File</h3>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".txt"
                />
                <Button
                  variant="outline"
                  onClick={handleBrowseClick}
                  className="w-full"
                >
                  {importedKeys ? importedKeys.name : "Browse for key file"}
                </Button>
              </div>
              
              <div className="border rounded-md p-4">
                <h3 className="font-medium mb-2">Or Enter Recovery Phrase</h3>
                <textarea
                  className="w-full min-h-[100px] p-2 border rounded-md"
                  placeholder="Paste your recovery phrase here"
                  value={recoveryPhrase}
                  onChange={(e) => setRecoveryPhrase(e.target.value)}
                />
              </div>
              
              <Input
                type="password"
                placeholder="Enter your encryption password"
                value={importPassword}
                onChange={(e) => setImportPassword(e.target.value)}
              />
              
              {importError && (
                <p className="text-sm text-red-500">{importError}</p>
              )}
              
              <Button 
                onClick={handleImportKeys} 
                disabled={(!importedKeys && !recoveryPhrase) || !importPassword}
                className="w-full"
              >
                Import Keys
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 