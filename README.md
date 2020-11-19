```js
const formData = new FormData();

const [file] = e.files;
formData.set("file", excelFile);

api({
  method: "post",
  url: "http://localhost:8175/upload-single",
  extendHeader: {
    "Content-Type": "multipart/form-data",
  },
  data: formData,
});
```
