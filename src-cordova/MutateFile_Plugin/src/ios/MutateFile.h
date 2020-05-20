#import <Cordova/CDV.h>

@interface MutateFile : CDVPlugin

- (void) mutate:(CDVInvokedUrlCommand*)command;
- (void) mutateV2:(CDVInvokedUrlCommand*)command;

@end
