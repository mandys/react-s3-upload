import React, { Component } from 'react';
var ReactS3Uploader = require('react-s3-uploader');
var AWS = require('aws-sdk');
const url = require('url');

AWS.config.update({
    accessKeyId: "YOUR_ACCESS_KEY",
    secretAccessKey: "YOUR_SECRET_KEY",
    "region": "us-east-1"  
}); 

class App extends Component {
    
    getSignedUrlFromAWS = async(fileObj) => {
        console.log('in getSignedUrlFromAWS')

        let filename = fileObj.objectName
        let mimeType = fileObj.contentType

        let s3Options = {};
        s3Options.region = 'us-east-1'
        s3Options.signatureVersion = 'v4'
        
        let s3 = new AWS.S3(s3Options);

        var params = {
            Bucket: 'tfiler',
            Key: filename,
            Expires: 86400,
            ContentType: mimeType,
            ACL: 'public-read'
        };

        const mySignedUrl = await s3.getSignedUrl('putObject', params)
        return mySignedUrl

    }

    getSignedUrl = async(file, callback) => {
        console.log('getSignedUrl')
        console.log('file', file)
        const params = {
            objectName: file.name,
            contentType: file.type
        }
        const signedUrl = await this.getSignedUrlFromAWS(params)
        console.log(signedUrl)
        let url_parts = url.parse(signedUrl)
        console.log('url_parts', url_parts)
        const data = {
            "signedUrl":signedUrl,
            "filename": url_parts.hostname + url_parts.pathname
         }
        callback(data);
    }
    onError = (e) => {
        console.log("ERROR")
        console.log(e)
    }
    onFinish = (res) => {
        console.log(res)
    }
    render() {
        return (
            <div>
                <h1>s3 File uploader</h1>
                <ReactS3Uploader
                    getSignedUrl={this.getSignedUrl}
                    accept="image/*"
                    onProgress={this.onProgress}
                    onError={this.onError}
                    onFinish={this.onFinish}
                    uploadRequestHeaders={{
                        'x-amz-acl': 'public-read'
                    }}
                    autoUpload={true}
                />
            </div>
        );
    }
}

export default App;
