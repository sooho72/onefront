import React, { useState, useEffect } from "react";
import { useSprings, animated, to as interpolate } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";
import "./Famous.css";

import card1 from "../../images/card1.jpg";
import card2 from "../../images/card2.jpg";
import card3 from "../../images/card3.jpg";
import card4 from "../../images/card4.jpg";
import card5 from "../../images/card5.jpg";

// 명언 데이터
const quotes = [
  "나라에 바칠 목숨이 오직 하나밖에 없는 것만이 나의 유일한 슬픔입니다. - 유관순",
  "백성은 나라의 근본이요, 근본이 튼튼해야 나라가 평안하다. - 세종대왕",
  "신에게는 아직 열두 척의 배가 있습니다. - 이순신",
  "일생에 한 번의 실수로도 큰 패배를 부를 수 있다. - 유승룡",
  "죽음이 두렵지 않습니다. 다만 그 죽음이 헛되지 않기를 바랍니다. - 윤봉길",
  "노력은 배신하지 않는다. - 박지성",
  "겸손은 사람을 더 단단하게 만든다. - 유재석",
  "포기하고 싶은 순간이 오히려 기회입니다. - 김연아",
  "항상 자신을 믿고 끝까지 최선을 다하세요. - 손흥민",
  "인생은 나그네길, 가는 세월 그 누가 막을 수 있으랴. - 박경리",
  "중요한 건 꺾여도 그냥하는는 마음이다. - 박명수",
];

// 카드 이미지
const cards = [card1, card2, card3, card4, card5];

// 애니메이션 설정
const to = (i) => ({
  x: 0,
  y: i * -4,
  scale: 1,
  rot: -10 + Math.random() * 20,
  delay: i * 100,
});
const from = (i) => ({ x: 0, rot: 0, scale: 1.5, y: -1000 });
const trans = (r, s) =>
  `perspective(1500px) rotateX(30deg) rotateY(${r / 10}deg) rotateZ(${r}deg) scale(${s})`;

function Famous() {
  const [gone] = useState(() => new Set()); // 넘어간 카드 인덱스 저장
  const [props, api] = useSprings(cards.length, (i) => ({
    ...to(i),
    from: from(i),
  }));
  const [randomQuotes, setRandomQuotes] = useState([]);

  // “처음 접속” 안내 메시지 상태
  const [showInstruction, setShowInstruction] = useState(true);

  // 모든 카드가 소진되었을 때의 메시지 상태
  const [allCardsGone, setAllCardsGone] = useState(false);

  // 하루 고정된 5개의 랜덤 명언 설정
  useEffect(() => {
    const today = new Date().getDate(); // 날짜 기준
    const seed = today % 10; // 간단한 랜덤 시드
    const shuffledQuotes = quotes
      .map((quote, i) => ({ quote, sort: (i + seed) % quotes.length }))
      .sort((a, b) => a.sort - b.sort)
      .slice(0, 5)
      .map((item) => item.quote); // 5개의 명언 선택
    setRandomQuotes(shuffledQuotes);
  }, []);

  // 카드 드래그
  const bind = useDrag(({ args: [index], down, movement: [mx], direction: [xDir], velocity }) => {
    // 첫 드래그 시 안내문 숨기기
    if (down && showInstruction) {
      setShowInstruction(false);
    }

    const trigger = Math.abs(mx) > 50 || velocity > 0.1; // 넘어가는 임계점
    const dir = xDir < 0 ? -1 : 1; // 왼쪽(-1), 오른쪽(+1)
    if (!down && trigger) gone.add(index);

    api.start((i) => {
      if (index !== i) return;
      const isGone = gone.has(index);
      const x = isGone ? (200 + window.innerWidth) * dir : down ? mx : 0;
      const rot = mx / 100 + (isGone ? dir * 10 * velocity : 0);
      const scale = down ? 1.1 : 1;

      return {
        x,
        rot,
        scale,
        delay: undefined,
        config: { friction: 50, tension: down ? 800 : isGone ? 200 : 500 },
      };
    });

    // 모든 카드가 사라졌는지 체크
    if (!down && gone.size === cards.length) {
      // 잠시 후 카드 덱 리셋
      setAllCardsGone(true);

      setTimeout(() => {
        gone.clear();
        api.start((i) => to(i));
        setAllCardsGone(false); // 메시지 다시 숨김
      }, 1500);
    }
  });

  return (
    <div className="famous-container">
      {/* 처음 안내문 */}
      {showInstruction && (
        <div className="famous-instruction">
          <p>하루마다 랜덤으로 5개 명언카드가 보여집니다.</p>
          카드를 왼쪽이나 오른쪽으로 드래그하여 명언을 확인해보세요!
        </div>
      )}

      {/* 모든 카드 소진 시 메시지 */}
      {allCardsGone && (
        <div className="famous-all-gone">
          모든 카드드를 확인하셨습니다! 잠시 후 다시 볼 수 있어요.
        </div>
      )}

      {props.map(({ x, y, rot, scale }, i) => (
        <animated.div key={i} className="deck" style={{ x, y }}>
          <animated.div
            {...bind(i)}
            style={{
              transform: interpolate([rot, scale], trans),
              backgroundImage: `url(${cards[i]})`,
            }}
          >
            <div className="quote">{randomQuotes[i]}</div>
          </animated.div>
        </animated.div>
      ))}
    </div>
  );
}

export default Famous;
