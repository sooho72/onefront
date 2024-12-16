// src/components/Main/Main.jsx
import React, { useState, useCallback, useRef, useEffect } from "react";
import { useTransition, animated } from "@react-spring/web";
import "./Main.css";
import Navsidebar from "../../components/Navsidebar";

function Main() {
  const ref = useRef([]);
  const [items, setItems] = useState(["one", "point", "up!"]);

  const transitions = useTransition(items, {
    from: { opacity: 0, transform: "translateY(20px)" },
    enter: { opacity: 1, transform: "translateY(0px)" },
    leave: { opacity: 0, transform: "translateY(-20px)" },
    config: { tension: 200, friction: 20 },
    trail: 200,
  });

  const cycleItems = useCallback(() => {
    ref.current.forEach(clearTimeout);
    ref.current = [];
    ref.current.push(setTimeout(() => setItems(["one", "point", "up!"]), 4000));
  }, []);

  useEffect(() => {
    cycleItems();
    return () => ref.current.forEach(clearTimeout);
  }, [cycleItems]);

  return (
    <div className="main-container">
      <Navsidebar/>
      <div className="main-image">
        <div className="animated-text" onClick={cycleItems}>
          {transitions((style, item, t, index) => (
            <animated.div key={index} style={style} className="animated-word">
              {item}
            </animated.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Main;
