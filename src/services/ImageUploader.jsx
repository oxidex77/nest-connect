import React, { useState } from 'react';
import { View, Alert, Image } from 'react-native';
import { Button, Card, IconButton, Text } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';

const ImageUploader = ({ 
  onImageSelected, 
  multiple = false, 
  maxImages = 5,
  currentImages = [],
  style 
}) => {
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera roll permissions to upload images.');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
        allowsMultipleSelection: multiple,
        selectionLimit: multiple ? maxImages : 1,
      });

      if (!result.canceled) {
        setUploading(true);
        
        if (multiple) {
          // Handle multiple images
          const imageUris = result.assets.map(asset => asset.uri);
          onImageSelected(imageUris);
        } else {
          // Handle single image
          onImageSelected(result.assets[0].uri);
        }
        
        setUploading(false);
      }
    } catch (error) {
      setUploading(false);
      Alert.alert('Error', 'Failed to pick image');
      console.error('Image picker error:', error);
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera permissions to take photos.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled) {
        setUploading(true);
        onImageSelected(result.assets[0].uri);
        setUploading(false);
      }
    } catch (error) {
      setUploading(false);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      'Select Image',
      'Choose an option',
      [
        { text: 'Camera', onPress: takePhoto },
        { text: 'Gallery', onPress: pickImage },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const removeImage = (index) => {
    const newImages = currentImages.filter((_, i) => i !== index);
    onImageSelected(newImages);
  };

  return (
    <View style={style}>
      {/* Current Images */}
      {currentImages.length > 0 && (
        <View style={{ marginBottom: 16 }}>
          {currentImages.map((imageUri, index) => (
            <Card key={index} style={{ marginBottom: 8 }}>
              <View style={{ position: 'relative' }}>
                <Image 
                  source={{ uri: imageUri }} 
                  style={{ width: '100%', height: 200, borderRadius: 8 }}
                  resizeMode="cover"
                />
                <IconButton
                  icon="close"
                  mode="contained"
                  size={20}
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(0,0,0,0.7)'
                  }}
                  iconColor="white"
                  onPress={() => removeImage(index)}
                />
              </View>
            </Card>
          ))}
        </View>
      )}

      {/* Add Image Button */}
      <Button
        mode="outlined"
        icon="camera"
        onPress={showImageOptions}
        loading={uploading}
        disabled={uploading || (multiple && currentImages.length >= maxImages)}
        style={{ marginVertical: 8 }}
      >
        {currentImages.length === 0 
          ? 'Add Images' 
          : multiple 
            ? `Add More (${currentImages.length}/${maxImages})`
            : 'Change Image'
        }
      </Button>

      {multiple && (
        <Text style={{ textAlign: 'center', color: '#666', fontSize: 12 }}>
          You can add up to {maxImages} images
        </Text>
      )}
    </View>
  );
};

export default ImageUploader;