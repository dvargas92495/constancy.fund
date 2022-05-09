// This started as a copy-paste of https://static.eversign.com/js/embedded-signing.js, edited for our use case

/* eversign embedded.js */

type EversignEvents = {
  loaded?: () => void;
  signed?: () => void;
  declined?: () => void;
  error?: (a?: string) => void;
  [k: string]: ((a?: string) => void) | undefined;
};

const eversign = {
  open: function (params: {
    url: string;
    containerID: string;
    width?: number | string;
    height?: number | string;
    events?: EversignEvents;
  }) {
    // parameters
    const iFrameWidth = params.width || 350;
    const iFrameHeight = params.height || 500;

    // callbacks
    eversign.callbacks = { ...params.events };

    // if iOS, add CSS styles to container element that prevent iOS from resizing iFrame
    if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
      const css = document.createElement("style");
      css.type = "text/css";
      css.innerHTML =
        "#" +
        params.containerID +
        " { width: " +
        iFrameWidth +
        "px; height: " +
        iFrameHeight +
        "px; overflow: hidden;";
      document.body.appendChild(css);
    }

    // add CSS rules vital to mobile scrolling to iFrame container element
    const container = document.getElementById(params.containerID);
    if (container) {
      if (iFrameWidth > 800) {
        container.style.overscrollBehavior = "touch";
        container.style.overflowY = "scroll";
      }

      // create iFrame
      const iFrame = document.createElement("iframe");
      container.appendChild(iFrame);

      iFrame.src = params.url;
      iFrame.width = iFrameWidth.toString();
      iFrame.height = iFrameHeight.toString();

      // listen to postMessage from child window
      window.addEventListener("message", eversign.windowListener, false);
    }
  },

  callbacks: {} as EversignEvents,

  windowListener: function (e: MessageEvent) {
    const eventType = e.data.split("_").pop();
    const eventTypes = ["loaded", "signed", "declined", "error"];
    const hasErrorMessage = e.data && e.data.error_message;

    if (
      eventType &&
      eventTypes.includes(eventType) &&
      eversign.callbacks[eventType]
    ) {
      const callback = eversign.callbacks[eventType];
      if (typeof callback == "function") callback();
    } else if (hasErrorMessage) {
      eversign.callbacks["error"]?.(e.data.error_message);
    }
  },
};

export default eversign;
