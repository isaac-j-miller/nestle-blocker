import { getUiGrocerUtils } from "./ui-grocer-utils/factory";
import { NestleBrandGetter } from "./nestle-product";
import { getGrocerFromHost } from "./grocers";

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

async function entrypoint() {
  console.info("Init plugin");
  await NestleBrandGetter.getNestleBrands();
  const grocerId = getGrocerFromHost(window.location.host);
  if (!grocerId) {
    console.warn(`failed to find grocer from host ${window.location.host}`);
    return;
  }
  console.info(`Identified grocer: ${grocerId}, instantiating utils...`);
  const utils = getUiGrocerUtils(grocerId);
  const styleElem = document.createElement("style");
  styleElem.innerHTML = nestleCss;
  document.head.appendChild(styleElem);
  let mostRecentModifyEvent = 0;
  const minInterval = 3000;
  const modifyElements = () => {
    console.info(`modifying elements...`);
    utils.modifyElements(document);
    mostRecentModifyEvent = new Date().valueOf();
  };
  const modifyElementsWithTimeLimit = () => {
    if (mostRecentModifyEvent + minInterval < new Date().valueOf()) {
      modifyElements();
    }
  };
  const eventsToListenToWithTimeLimit = ["click", "scroll"];
  eventsToListenToWithTimeLimit.forEach((eventType) => {
    window.addEventListener(eventType, modifyElementsWithTimeLimit);
  });
  const eventsToListenToWithDelay = ["submit", "load"];
  eventsToListenToWithDelay.map((eventType) =>
    window.addEventListener(eventType, () => {
      setTimeout(modifyElements, 1500);
    })
  );
  const eventsToListenToWithNoLimit = ["load"];
  eventsToListenToWithNoLimit.forEach((eventType) => {
    window.addEventListener(eventType, modifyElements);
  });
}

void entrypoint();
