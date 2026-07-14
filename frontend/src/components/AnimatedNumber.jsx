import { useEffect, useState } from "react";
import { animate } from "framer-motion";

const AnimatedNumber = ({
  value = 0,
  prefix = "",
  suffix = "",
  decimals = 0,
  formatter,
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(displayValue, value, {
      duration: 0.8,
      ease: "easeOut",
      onUpdate(latest) {
        setDisplayValue(latest);
      },
    });

    return () => controls.stop();
  }, [value]);

 const formatted = formatter
  ? formatter(displayValue)
  : displayValue.toFixed(decimals);

  return (
    <>
      {prefix}
      {formatted}
      {suffix}
    </>
  );
};

export default AnimatedNumber;