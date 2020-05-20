#import "MutateFile.h"

@implementation MutateFile

- (void)mutate:(CDVInvokedUrlCommand*)command
{
    NSString* callbackId = [command callbackId];
    NSString* filepath = [[command arguments] objectAtIndex:0];
    NSString* key = [[command arguments] objectAtIndex:1];
    NSURL *url = [NSURL URLWithString:filepath];
    NSFileManager *filemgr;
    filemgr = [NSFileManager defaultManager];
    if([filemgr fileExistsAtPath:[url path]]==YES){
        NSLog(@"file exist");

        for (int i=1; i<3; i++){
            FILE *fileHandle = fopen([[url path] UTF8String], "r");
            fseek(fileHandle, i*32+1, SEEK_CUR);
            char buffer[32];
            fread(buffer, 32, 1, fileHandle);
            fclose(fileHandle);

            for(int j=0;j<32;j++){
                char temp = (char)((int)buffer[j] ^ (int)[key characterAtIndex:j]);
                buffer[j] = temp;
            }

            fileHandle = fopen([[url path] UTF8String], "r+");
            fseek(fileHandle, i*32+1 , SEEK_SET);
            fwrite(buffer, 32, 1, fileHandle);
            fclose(fileHandle);
        }
        CDVPluginResult* result = [CDVPluginResult
                                   resultWithStatus:CDVCommandStatus_OK
                                   messageAsString:@"Success"];
        [self.commandDelegate sendPluginResult:result callbackId:callbackId];


    }else{
        NSLog(@"file not found");
        CDVPluginResult* result = [CDVPluginResult
                                   resultWithStatus:CDVCommandStatus_ERROR
                                   messageAsString:@"FILE NOT FOUND"];

        [self.commandDelegate sendPluginResult:result callbackId:callbackId];
    }


}

- (void)mutateV2:(CDVInvokedUrlCommand*)command
{
  NSString* callbackId = [command callbackId];
  NSString* filepath = [[command arguments] objectAtIndex:0];
  NSString* key = [[command arguments] objectAtIndex:1];
  NSURL *url = [NSURL URLWithString:filepath];
  NSFileManager *filemgr;
  filemgr = [NSFileManager defaultManager];
  if([filemgr fileExistsAtPath:[url path]]==YES){
      NSLog(@"V2 file exist");
      FILE *fileHandle = fopen([[url path] UTF8String], "r");
      fseek(fileHandle, 0, SEEK_SET);
      char buffer[32];
      fread(buffer, 32, 1, fileHandle);
      for(int j=0; j<32; j++){
          char temp = (char)((int)buffer[j] ^ (int)[key characterAtIndex:j]);
          buffer[j] = temp;
      }
      fileHandle = fopen([[url path] UTF8String], "r+");
      fseek(fileHandle, 0, SEEK_SET);
      fwrite(buffer, 32, 1, fileHandle);
      fclose(fileHandle);
      CDVPluginResult* result = [CDVPluginResult
                                 resultWithStatus:CDVCommandStatus_OK
                                 messageAsString:@"Success"];
      [self.commandDelegate sendPluginResult:result callbackId:callbackId];
  } else {
      NSLog(@"V2 file not found");
      CDVPluginResult* result = [CDVPluginResult
                                 resultWithStatus:CDVCommandStatus_ERROR
                                 messageAsString:@"FILE NOT FOUND"];
      [self.commandDelegate sendPluginResult:result callbackId:callbackId];
  }
}

@end
