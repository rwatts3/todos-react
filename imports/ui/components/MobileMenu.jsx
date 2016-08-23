import React from 'react';
// XXX:30 no session!
import { Session } from 'meteor/session';

function toggleMenu() {
  Session.set('menuOpen', !Session.get('menuOpen'));
}

const MobileMenu = () => (
  <div className="nav-group">
    <a href="#" className="nav-item" onClick={toggleMenu}>
      <span className="icon-list-unordered" title="Show menu"></span>
    </a>
  </div>
);

export default MobileMenu;
