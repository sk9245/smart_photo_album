document.getElementById('displaytext').style.display = 'none';
 
function searchPhoto() {
 var apigClient = apigClientFactory.newClient(
   {apiKey: "kDM3m53zft1EVPhSjOm0P11PfDxPMrej1K7oqRKs"}
 );
 
 var user_message = document.getElementById('note-textarea').value;
  console.log("User message input: ", user_message);
 
 var body = {};
 var params = { q: user_message };
 var additionalParams = {
   headers: {
     'Content-Type': 'application/json',
   },
 };
 console.log("params => ", params);
 
 apigClient
   .searchGet(params, body, additionalParams)
   .then(function (res) {
     var data = {};
     var data_array = [];
     console.log('Before getting the response');
    
    
     resp_data = res.data;
     length_of_response = resp_data.length;
    
     console.log('After getting the response');
 
     // console.log(resp_data);
    
     console.log("IGNORE ME");
     console.log(resp_data['body']['results']);
      
     if (resp_data['body']['results'].length == 0) {
       document.getElementById('displaytext').innerHTML =
         'Sorry could not find the image. Try again!' ;
       document.getElementById('displaytext').style.display = 'block';
     }
 
     resp_data = resp_data['body']['results']
    
     resp_data.forEach(function (obj) {
       var img = new Image();
       console.log(obj);
       img.src = obj;
       img.setAttribute('class', 'banner-img');
       img.setAttribute('alt', 'effy');
       document.getElementById('displaytext').innerHTML =
         'Images returned are : ';
       document.getElementById('img-container').appendChild(img);
       document.getElementById('displaytext').style.display = 'block';
     });
   })
   .catch(function (result) {});
}
 
function getBase64(file) {
 return new Promise((resolve, reject) => {
   const reader = new FileReader();
   reader.readAsDataURL(file);
   // reader.onload = () => resolve(reader.result)
   reader.onload = () => {
     let encoded = reader.result.replace(/^data:(.*;base64,)?/, '');
     if (encoded.length % 4 > 0) {
       encoded += '='.repeat(4 - (encoded.length % 4));
     }
     resolve(encoded);
   };
   reader.onerror = (error) => reject(error);
 });
}
 
function uploadPhoto() {
 var file = document.getElementById('file_path').files[0];
 const reader = new FileReader();
 
 var file_data;
 var encoded_image = getBase64(file).then((data) => {
   console.log(data);
   var apigClient = apigClientFactory.newClient(
     {apiKey: "kDM3m53zft1EVPhSjOm0P11PfDxPMrej1K7oqRKs"}
   );
 
   var file_type = file.type + ';base64';
 
   var body = data;
   var params = {
     key: file.name,
     bucket: 'album-photo-store',
     'Content-Type': file.type,
     'x-amz-meta-customLabels': note_customtag.value,
     'Accept': 'image/*'
   };
   console.log(note_customtag.value)
   var additionalParams = {};
   apigClient
     .uploadBucketKeyPut(params, body, additionalParams)
     .then(function (res) {
       if (res.status == 200) {
         document.getElementById('uploadText').innerHTML =
           ':) Your image is uploaded successfully!';
         document.getElementById('uploadText').style.display = 'block';
       }
     });
 });
}
