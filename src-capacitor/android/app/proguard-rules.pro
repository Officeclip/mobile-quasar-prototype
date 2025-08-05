# Capacitor Core Rules
-keep class com.getcapacitor.** { *; }
-keep interface com.getcapacitor.** { *; }
-keep enum com.getcapacitor.** { *; }

# Keep all Capacitor plugins
-keep class com.capacitorjs.plugins.** { *; }
-keep interface com.capacitorjs.plugins.** { *; }

# Camera Plugin Specific
-keep class com.capacitorjs.plugins.camera.** { *; }
-keep class com.capacitorjs.plugins.camera.CameraPlugin { *; }

# Filesystem Plugin
-keep class com.capacitorjs.plugins.filesystem.** { *; }

# Status Bar Plugin
-keep class com.capacitorjs.plugins.statusbar.** { *; }

# App Plugin
-keep class com.capacitorjs.plugins.app.** { *; }

# Keep plugin annotations and reflection
-keepclassmembers class * {
    @com.getcapacitor.annotation.CapacitorPlugin *;
    @com.getcapacitor.PluginCall *;
    @com.getcapacitor.PluginMethod *;
}

# Keep all classes that extend Plugin
-keep class * extends com.getcapacitor.Plugin {
    public <methods>;
    public <fields>;
}

# Keep WebView JavaScript interface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Keep native methods
-keepclasseswithmembernames class * {
    native <methods>;
}

# Keep reflection-based annotations
-keepattributes *Annotation*
-keepattributes Signature
-keepattributes InnerClasses
-keepattributes EnclosingMethod
-keepattributes RuntimeVisibleAnnotations
-keepattributes RuntimeInvisibleAnnotations
-keepattributes RuntimeVisibleParameterAnnotations
-keepattributes RuntimeInvisibleParameterAnnotations

# AndroidX rules
-keep class androidx.** { *; }
-keep interface androidx.** { *; }

# JSON serialization (if using Gson/Jackson)
-keepattributes Signature
-keepattributes *Annotation*
-keep class sun.misc.Unsafe { *; }

# Keep JavaScript bridge methods
-keepclassmembers class * extends android.webkit.WebViewClient {
    public void *(android.webkit.WebView, java.lang.String, android.graphics.Bitmap);
    public boolean *(android.webkit.WebView, java.lang.String);
}

# File Provider rules
-keep class androidx.core.content.FileProvider { *; }

# Keep Exception classes (for proper error handling)
-keep class * extends java.lang.Exception

# Prevent obfuscation of plugin method names called from JavaScript
-keepclassmembers class * extends com.getcapacitor.Plugin {
    @com.getcapacitor.PluginMethod public *;
}

# JSObject serialization
-keep class com.getcapacitor.JSObject { *; }
-keep class com.getcapacitor.JSArray { *; }
