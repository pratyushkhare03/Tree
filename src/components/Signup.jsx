@@ .. @@
-import React, { useState } from 'react';
+import React, { useState } from 'react';
+import { useNavigate } from 'react-router-dom';
 import { useAuth } from '../contexts/AuthContext';
 import { UserPlus, Mail, Lock, User, Eye, EyeOff, ArrowRight, CheckCircle, Github, Chrome } from 'lucide-react';
 
 const Signup = ({ onSwitchToLogin }) => {
+  const navigate = useNavigate();
   const [username, setUsername] = useState('');
@@ .. @@
     const result = await signup(username, email, password);
     
-    if (!result.success) {
+    if (result.success) {
+      navigate('/dashboard');
+    } else {
       setError(result.error);
     }
     
     setLoading(false);