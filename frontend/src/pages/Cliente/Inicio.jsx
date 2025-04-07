import React from "react";
import Card from './card';
import { cardsData } from './data';
import './CardStyles.css';

const Inicio = () => {
  return (
    <div className="cards-container">
      <div className="cards-grid">
        {cardsData.map((card) => (
          <Card
            key={card.id}
            image={card.image}
            title={card.title}
            line1={card.line1}
            line2={card.line2}
          />
        ))}
      </div>
    </div>
  );
};
  
  export default Inicio;
  