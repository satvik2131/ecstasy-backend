const admin = require('firebase-admin');
var bucket = admin.storage().bucket();
const fs = require('fs');
const functions = require('firebase-functions');
const { ref } = require('firebase-functions/lib/providers/database');
const { callbackify } = require('util');



//uploading video and saving it to the database 
const compressAndUploadVideo = async (file,userName,res) => {
    var metadata = {
      contentType: 'video/mp4',
    }
    
    const blob =  bucket.file('videos/'+userName);
    const blobStream = blob.createWriteStream({
      metadata,
    });

    var child_process = require('child_process');
    var args = [
      '-i', 'pipe:0',
      '-f', 'mp4',
      '-movflags', 'frag_keyframe+empty_moov',
      '-vcodec', 'libx265',
      '-preset', 'veryfast',
      '-crf', '28',
      'pipe:1',
    ]; 
  
    const ffmpeg = child_process.spawn('ffmpeg', args);
    await file.pipe(ffmpeg.stdin);
    ffmpeg.stdout.pipe(blobStream);

  
    ffmpeg.on('error', function (err) {
      console.log(err);
    });

    ffmpeg.on('close', function (code) {
      console.log('ffmpeg exited with code ' + code);
    });

    ffmpeg.stderr.on('data', function (data) {
      // console.log('stderr: ' + data);
      var tData = data.toString('utf8');
      // var a = tData.split('[\\s\\xA0]+');
      var a = tData.split('\n');
      console.log(a);
    });

    ffmpeg.stdout.on('data', function (data) {
      var frame = new Buffer(data).toString('base64');
      // console.log(frame);
    });

  

    const url = await  blob.getSignedUrl({
      action: 'read',
      expires: '03-09-2491'
    })

    return url[0];
  }

  
  const MRSUploadData = async (url,id,userName,title,desc)=>{
    var refer = admin.database().ref('PENDING_VIDEOS/'+id);
    var vnum = 0 ;
    let videoid ;
     
    refer.on('value',(snapshot)=>{
      var data = snapshot.val();
      if(data){
        console.log(data);
          vnum = (data.vnum+1);
      }
    })
  
    videoid = vnum + id;

    
    await refer.child(videoid).push({
      title:title,
      desc:desc,
      dislikes:0,
      id:id,
      likes:0,
      name:userName,
      shares:0,
      status:'pending',
      url:url,
      view:0,
      vnum:vnum,
      videoid:videoid
    },function(error) {
      if (error) {
        console.log('The write failed...');
      } else {
        console.log('Data saved successfully!');
      }
    });
  }

 

  
module.exports = {
    compressAndUploadVideo,
    MRSUploadData
}