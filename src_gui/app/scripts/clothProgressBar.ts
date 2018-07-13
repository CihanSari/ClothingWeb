import * as $ from "jquery";
export class ClothProgressBar {
  private progressRequestSentCount = 0;
  private progressRequestReceivedCount = 0;
  private goingOnceGoingTwice = false;
  constructor() {
    $("#progressbar").show();
  }

  fncUpdateProgress() {
    if (this.progressRequestReceivedCount == this.progressRequestSentCount) {
      if (this.goingOnceGoingTwice) {
        $("#progressbar").hide();
        return;
      }
      this.goingOnceGoingTwice = true;
      setTimeout(() => {
        this.fncUpdateProgress();
      }, 100);
    } else {
      this.goingOnceGoingTwice = false;
    }
    // $("#progressbar").progressbar({
    //   value: Math.ceil(
    //     (this.progressRequestReceivedCount / this.progressRequestSentCount) *
    //       100
    //   )
    // });
  }
  fncProgressGenCallback() {
    this.progressRequestSentCount += 1;
    this.fncUpdateProgress();
    return () => {
      this.progressRequestReceivedCount += 1;
      this.fncUpdateProgress();
    };
  }
  initProgress() {
    setTimeout(this.fncProgressGenCallback(), 500);
  }
}
