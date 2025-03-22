"use client";

import React from "react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function LogoShowcase() {
  return (
    <div className="relative overflow-hidden rounded-xl border bg-background p-8 md:p-10">
      {/* Background effects */}
      <div className="absolute top-0 right-0 h-[300px] w-[300px] bg-primary/10 rounded-full blur-[150px] -z-10"></div>
      <div className="absolute bottom-0 left-0 h-[200px] w-[200px] bg-primary/5 rounded-full blur-[100px] -z-10"></div>
      
      <div className="grid gap-10 md:grid-cols-2 items-center">
        <div className="flex flex-col gap-6 order-2 md:order-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              Preserve Your Legacy
            </h1>
            <p className="text-muted-foreground text-lg mt-4 max-w-lg">
              TimeCapsule lets you create end-to-end encrypted messages that deliver
              exactly when you want them to, preserving your memories for future generations.
            </p>
          </motion.div>
          
          <motion.div 
            className="flex flex-col gap-3 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <span className="font-medium">End-to-end encrypted content</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <span className="font-medium">Schedule delivery for any future date</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <span className="font-medium">Self-destructing messages for privacy</span>
            </div>
          </motion.div>
          
          <motion.div 
            className="flex flex-wrap gap-4 mt-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button asChild size="lg" className="group">
              <Link href="/capsules/create" className="flex items-center">
                Create Time Capsule
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/capsules">
                View Your Capsules
              </Link>
            </Button>
          </motion.div>
        </div>
        
        <motion.div 
          className="flex justify-center items-center order-1 md:order-2"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 0.6,
            type: "spring",
            stiffness: 100
          }}
        >
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl -z-10"></div>
            
            {/* Logo container */}
            <div className="bg-gradient-to-br from-background to-background/80 rounded-2xl border shadow-lg p-10 backdrop-blur-sm">
              <Logo size="lg" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 