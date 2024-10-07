// import encapsulated netwokr request tool - http.js
import http from '../utils/http'

export const reqSwiperData = () => http.get('index/findBanner')