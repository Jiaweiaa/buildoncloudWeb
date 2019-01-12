function myCallback(res) {
  switch (res.data.code) {
    case 1:
      this.$notify.error({
        title: res.data.msg,
      });
      break;
    case 0:
      this.$notify.success({
        title: res.data.msg,
      });
      break;
    case 302:
      this.$notify.error({
        title: res.data.msg,
      });
      break;
    case 99:
      this.$router.replace('/');
      this.$notify.warning({
        title: res.data.msg,
      });
      break;
    default:
      this.$notify.warning({
        title: res.data.msg,
      });
      break;
  }
}

export default myCallback
