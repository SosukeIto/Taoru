function isInteger(str) {
  // 数字に変換
  const num = Number(str);

  // 数字であるか、整数であるかをチェック
  if (!isNaN(num) && Number.isInteger(num)) {
    return true;
  } else {
    return false;
  }
}
module.exports = {
  isInteger: isInteger
}