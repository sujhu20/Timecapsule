
const devKeyBase64 = 'ZGV2LWtleS1kb25vdHVzZWlucHJvZHVjdGlvbjEyMzQ=';
const buffer = Buffer.from(devKeyBase64, 'base64');
console.log('Decoded string:', buffer.toString());
console.log('Buffer length:', buffer.length);
if (buffer.length === 32) {
    console.log('✅ Length is correct (32 bytes)');
} else {
    console.error('❌ Length is INCORRECT:', buffer.length);
}
