import { getUiGrocerUtils } from "./ui-grocer-utils/factory";
import { NestleBrandGetter } from "./nestle-product";
import { getGrocerFromHost } from "./grocers";
import { Logger, LogLevel } from "./logger";

const nestleCss = `
.anti-nestle {
    position: relative;
    overflow: hidden;
}

.anti-nestle:after {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    content: "";
    border: 6px solid red;
    background-color: red;
    transform: rotate(45deg);
    opacity: 65%;
    z-index: 999;
}
.anti-nestle:before {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    content: "";
    border: 6px solid red;
    background-color: red;
    transform: rotate(-45deg);
    opacity: 65%;
    z-index: 999;
}
`;

Logger.level = LogLevel.INFO;
const logger = new Logger("content-script");
async function entrypoint() {
  logger.info("Init plugin");
  try {
    await NestleBrandGetter.getNestleBrands(document);
  } catch (e) {
    logger.error(e);
    logger.error("unable to fetch nestle brand list; shutting down...");
    return;
  }
  const grocerId = getGrocerFromHost(window.location.host);
  if (!grocerId) {
    logger.warn(`failed to find grocer from host ${window.location.host}`);
    return;
  }
  logger.info(`Identified grocer: ${grocerId}, instantiating utils...`);
  const utils = getUiGrocerUtils(grocerId);
  const styleElem = document.createElement("style");
  styleElem.innerHTML = nestleCss;
  document.head.appendChild(styleElem);
  let mostRecentModifyEvent = 0;
  const minInterval = 3000;
  const modifyElements = () => {
    logger.debug(`modifying elements...`);
    utils.modifyElements(document);
    mostRecentModifyEvent = new Date().valueOf();
  };
  const modifyElementsWithTimeLimit = () => {
    if (mostRecentModifyEvent + minInterval < new Date().valueOf()) {
      modifyElements();
    }
  };
  const eventsToListenToWithTimeLimit = ["click", "scroll", "mousemove"];
  const eventsToListenToWithDelay = ["submit", "load"];
  const eventsToListenToWithNoLimit = ["load"];

  eventsToListenToWithTimeLimit.forEach(eventType => {
    window.addEventListener(eventType, modifyElementsWithTimeLimit);
  });
  eventsToListenToWithDelay.map(eventType =>
    window.addEventListener(eventType, () => {
      setTimeout(modifyElements, 1500);
    })
  );
  eventsToListenToWithNoLimit.forEach(eventType => {
    window.addEventListener(eventType, modifyElements);
  });
}

void entrypoint();
