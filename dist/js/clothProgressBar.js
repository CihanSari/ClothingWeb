class ClothProgressBar
{
  constructor() {
    $("#progressbar").show();
    this.progressRequestSentCount = 0;
    this.progressRequestReceivedCount = 0;
    this.goingOnceGoingTwice = false;
  }

  fncUpdateProgress() {
    if (this.progressRequestReceivedCount == this.progressRequestSentCount) {
      if (this.goingOnceGoingTwice) {
        $("#progressbar").hide();
        return;
      }
      this.goingOnceGoingTwice = true;
      setTimeout(() => {
        this.fncUpdateProgress()
      }, 100);
    }
    else {
      this.goingOnceGoingTwice = false;
    }
    $("#progressbar").progressbar({
      value: Math.ceil(this.progressRequestReceivedCount / this.progressRequestSentCount * 100)
    });
  }
  fncProgressGenCallback() {
    this.progressRequestSentCount += 1;
    this.fncUpdateProgress();
    return () => {
      this.progressRequestReceivedCount += 1;
      this.fncUpdateProgress();
    }
  }
  initProgress() {
    setTimeout(this.fncProgressGenCallback(), 500);
  }
}
