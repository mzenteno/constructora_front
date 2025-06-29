import { useEffect } from "react";

export const ExternalScriptsLoader = () => {
  useEffect(() => {
    //const scripts = ["/vendors/js/vendor.bundle.base.js", "/js/hoverable-collapse.js", "/js/off-canvas.js", "/js/misc.js"];
    const scripts = ["/js/misc.js"];

    const scriptElements = scripts.map((src) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = false; // importante: mantener el orden
      script.defer = true; // ejecutar después del DOM
      document.body.appendChild(script);
      return script;
    });

    return () => {
      scriptElements.forEach((script) => {
        document.body.removeChild(script);
      });
    };
  }, []);

  return null;
};
