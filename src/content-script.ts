import { getGrocerFromHost, getUiGrocerUtils } from "./ui-grocer-utils/factory";
import { NestleBrandGetter } from "./nestle-product";

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
  const minInterval = 15000;
  const modifyElements = () => {
    if (mostRecentModifyEvent + minInterval < new Date().valueOf()) {
      console.info(`modifying elements...`);
      utils.modifyElements();
      mostRecentModifyEvent = new Date().valueOf();
    }
  };
  const eventsToListenTo = ["click", "scroll"];
  eventsToListenTo.forEach((eventType) => {
    window.addEventListener(eventType, modifyElements);
  });
  window.addEventListener("load", () => {
    console.info(`modifying elements...`);
    utils.modifyElements();
    mostRecentModifyEvent = new Date().valueOf();
  });
}

void entrypoint();
