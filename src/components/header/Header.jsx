'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Globe, Menu, X } from 'lucide-react';

export default function Header() {

  let [lang, setLang] = useState('en');
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('lang') === 'ar' || localStorage.getItem('lang') === 'en') {
        setLang(localStorage.getItem('lang'));
        // localStorage.setItem('lang', 'en');
      }
      else {
        localStorage.setItem('lang', 'en');
        setLang('en');
      }
    }
  }, [lang]);
  
  return (
    <header className={` header`} style={{ direction: lang === 'ar' ? 'rtl' : 'ltr' }} >
      <div className="container m-auto flex items-center gap-2 justify-between">
        <Link href="/"> 
        {/* <Image src={logo} alt="logo" className="logo-img" /> */}
        <h1 className="logo">Ahmed Elsayed</h1>
        </Link>
        <div className="links">
          
          <div
            className="lang-btn"
            onClick={() => {
              if (lang === 'en') {
                localStorage.setItem('lang', 'ar');
                setLang('ar');
              } else {
                localStorage.setItem('lang', 'en');
                setLang('en');
              }
              window.location.reload(); // Reloads the page
            }}
          >
            <Globe size={20} />
          </div>
        </div>

        <Menu className='menu-bars' onClick={() => {
          document.querySelector('.side-menu').classList.toggle('side-menu-active')
          document.querySelector('.menu-bars').classList.toggle('hidden')
          document.querySelector('.menu-bars-X').classList.toggle('hidden')
        }} />
        <X className='menu-bars-X hidden' onClick={() => {
          document.querySelector('.side-menu').classList.toggle('side-menu-active')
          document.querySelector('.menu-bars').classList.toggle('hidden')
          document.querySelector('.menu-bars-X').classList.toggle('hidden')
        }} />
        <div className="side-menu" onClick={() => {
          document.querySelector('.side-menu').classList.toggle('side-menu-active')
          document.querySelector('.menu-bars').classList.toggle('hidden')
          document.querySelector('.menu-bars-X').classList.toggle('hidden')
        }}>
          <div className="links">
            
            <div
              className="lang-btn"
              onClick={() => {
                if (lang === 'en') {
                  localStorage.setItem('lang', 'ar');
                  setLang('ar');
                } else {
                  localStorage.setItem('lang', 'en');
                  setLang('en');
                }
                window.location.reload(); // Reloads the page
              }}
            >
              <Globe size={20} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}