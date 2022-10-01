# Endpoints

# /profile/upload
Video uploading and compression route Send the video files and title as title and description as desc in multipart data format in key value pairs

# MRSUpload(url,id,userName,title,desc);
method to upload the data to the pending videos in the database make the fieldname as title and desc and send to the server

# Video Uploading
upload video files and other text as key value pairs in the form of multiform data

# /push/to/videos
this endpoint will delete the reference of the video from PENDING_VIDEOS database node and move it to Videos database