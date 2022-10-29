import React, { useEffect } from "react";
import LottieAnimation from "lottie-web";

const Error = () => {
  useEffect(() => {
    LottieAnimation.loadAnimation({
      container: document.querySelector(".lottie-Error")!, // the dom element that will contain the animation
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: "/98488-bot-error-404.json", // the path to the animation json
      rendererSettings: {
        className: "lottie-animation-error",
      },
    });
  }, []);

  return <div className="lottie-Error"></div>;
};

export default Error;
