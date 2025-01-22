# Add any ProGuard rules specific to your project here

# Keep class names for classes that are used in reflection
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Keep class names for classes that are used in serialization
-keepclassmembers class * implements java.io.Serializable {
    static final long serialVersionUID;
    private static final java.io.ObjectStreamField[] serialPersistentFields;
    private void writeObject(java.io.ObjectOutputStream);
    private void readObject(java.io.ObjectInputStream);
    java.lang.Object writeReplace();
    java.lang.Object readResolve();
}
