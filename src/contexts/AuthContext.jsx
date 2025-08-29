@@ .. @@
 import React, { createContext, useContext, useState, useEffect } from 'react';
-import axios from 'axios';
 
 // Create the context
@@ .. @@
-  // Configure axios defaults
-  useEffect(() => {
-    if (token) {
-      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
-    } else {
-      delete axios.defaults.headers.common['Authorization'];
-    }
-  }, [token]);
-
   // Check if user is logged in when app starts
@@ .. @@
       if (token) {
         try {
           console.log('Checking authentication...');
-          const response = await axios.get('http://localhost:5000/api/profile');
-          setCurrentUser(response.data.user);
-          console.log('User authenticated:', response.data.user);
+          const response = await fetch('http://localhost:5000/api/profile', {
+            headers: {
+              'Authorization': `Bearer ${token}`
+            }
+          });
+          
+          if (response.ok) {
+            const data = await response.json();
+            setCurrentUser(data.user);
+            console.log('User authenticated:', data.user);
+          } else {
+            throw new Error('Authentication failed');
+          }
         } catch (error) {
@@ .. @@
   const signup = async (username, email, password) => {
     try {
       console.log('Attempting signup...');
-      const response = await axios.post('http://localhost:5000/api/register', {
-        username,
-        email,
-        password
+      const response = await fetch('http://localhost:5000/api/register', {
+        method: 'POST',
+        headers: {
+          'Content-Type': 'application/json'
+        },
+        body: JSON.stringify({
+          username,
+          email,
+          password
+        })
       });
       
-      const { token: newToken, user } = response.data;
+      const data = await response.json();
+      
+      if (!response.ok) {
+        throw new Error(data.message || 'Signup failed');
+      }
+      
+      const { token: newToken, user } = data;
       localStorage.setItem('treeAuthToken', newToken);
@@ .. @@
       return { 
         success: false, 
-        error: error.response?.data?.message || 'Signup failed. Please try again.' 
+        error: error.message || 'Signup failed. Please try again.' 
       };
@@ .. @@
   const login = async (email, password) => {
     try {
       console.log('Attempting login...');
-      const response = await axios.post('http://localhost:5000/api/login', {
-        email,
-        password
+      const response = await fetch('http://localhost:5000/api/login', {
+        method: 'POST',
+        headers: {
+          'Content-Type': 'application/json'
+        },
+        body: JSON.stringify({
+          email,
+          password
+        })
       });
       
-      const { token: newToken, user } = response.data;
+      const data = await response.json();
+      
+      if (!response.ok) {
+        throw new Error(data.message || 'Login failed');
+      }
+      
+      const { token: newToken, user } = data;
       localStorage.setItem('treeAuthToken', newToken);
@@ .. @@
       return { 
         success: false, 
-        error: error.response?.data?.message || 'Login failed. Please check your credentials.' 
+        error: error.message || 'Login failed. Please check your credentials.' 
       };
@@ .. @@
 };