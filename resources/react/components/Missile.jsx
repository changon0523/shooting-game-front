import React from 'react';

const Missile = ({ missile }) => {
  return (
    <div
      key={missile.id}
      className="missile absolute"
      style={{
        left: `${missile.x}px`,
        top: `${missile.y}px`,
        width: `${missile.width}px`,
        height: `${missile.height}px`,
        backgroundColor: '#ffd700',
        boxShadow: '0 0 8px #ffd700, 0 0 12px #ff8c00',
        borderRadius: '2px'
      }}
    />
  );
};

const MissileList = ({ missiles }) => {
  return (
    <>
      {missiles.map((missile) => (
        <Missile key={missile.id} missile={missile} />
      ))}
    </>
  );
};

export default MissileList;
