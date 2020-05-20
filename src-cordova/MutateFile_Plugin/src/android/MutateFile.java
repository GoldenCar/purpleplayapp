package com.mutatefile.plugin;

import java.io.FileNotFoundException;
import java.io.RandomAccessFile;
import java.net.URI;
import java.net.URL;

import org.apache.cordova.*;
import org.json.JSONArray;
import org.json.JSONException;

import android.util.Log;

public class MutateFile extends CordovaPlugin {

    @Override
    public boolean execute(String action, JSONArray data, CallbackContext callbackContext) throws JSONException {
    	if(action.equals("mutate")){
    		String filepath = data.getString(0);
    		String key = data.getString(1);
        try {
        	URL url = new URL(filepath);
        	String path = java.net.URLDecoder.decode(url.getPath(), "UTF-8");
  				for (int i=1; i<3; i++){
  					RandomAccessFile raf = new RandomAccessFile(path, "r");
  					byte buffer[] = new byte[32];
  					raf.seek(i*32+1);
  					raf.read(buffer, 0, 32);
  					raf.close();

  					for(int j=0;j<32;j++){
  						byte temp = (byte) (buffer[j] ^ key.getBytes()[j]);
  						buffer[j] = temp;
  					}

  					raf = new RandomAccessFile(path, "rw");
  					raf.seek(i*32+1);
  					raf.write(buffer, 0, 32);
  					raf.close();
  				}
  			} catch (Exception e) {
  				// TODO Auto-generated catch block
  				e.printStackTrace();
  				callbackContext.error("error: " + e.getMessage());
  	    		return false;
  			}
    		callbackContext.success("true");
    		return true;

    	} else if(action.equals("mutateV2")) {
        String filepath = data.getString(0);
    		String key = data.getString(1);
        try {
        	URL url = new URL(filepath);
        	String path = java.net.URLDecoder.decode(url.getPath(), "UTF-8");
					RandomAccessFile raf = new RandomAccessFile(path, "r");
					byte buffer[] = new byte[32];
					raf.seek(0);
					raf.read(buffer, 0, 32);
					raf.close();
					for(int j=0; j<32; j++){
						byte temp = (byte) (buffer[j] ^ Character.codePointAt(key, j));
						buffer[j] = temp;
					}
					raf = new RandomAccessFile(path, "rw");
					raf.seek(0);
					raf.write(buffer, 0, 32);
					raf.close();
  			} catch (Exception e) {
  				// TODO Auto-generated catch block
  				e.printStackTrace();
  				callbackContext.error("error: " + e.getMessage());
  	    		return false;
  			}
    		callbackContext.success("true");
    		return true;
      } else {
    		callbackContext.error("error");
    		return false;
    	}

    }
}
