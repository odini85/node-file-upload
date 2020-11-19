```js
const formData = new FormData();

const [file] = e.files;
formData.set("file", excelFile);

axios({
  method: "post",
  url: "http://localhost:8175/upload-single",
  headers: {
    "Content-Type": "multipart/form-data",
  },
  data: formData,
});
```
