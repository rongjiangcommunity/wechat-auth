/* eslint-disable max-len */
'use strict';

const {CADMIN, XIAOYOU, ADMIN} = require('./extend/helper');

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const isWxLogin = app.middleware.isWxLogin();
  const authtoken = app.middleware.authToken();
  const checkRole = app.middleware.checkRole;
  const prereview = app.middleware.prereview();

  const {router, controller: c} = app;
  router.get('/', c.home.index);

  router.post('/api/wechat/redeem', c.wechat.redeem);
  router.post('/api/wechat/expire', c.wechat.expire);
  router.post('/api/wechat/decrypt/:sid', isWxLogin, c.wechat.decrypt);
  // TODO: @deprecated
  router.post('/api/wechat/:sid/decrypt', isWxLogin, c.wechat.decrypt);

  router.get('/api/user/:sid', isWxLogin, c.user.info);
  router.post('/api/user/:sid', isWxLogin, c.user.save);
  router.post('/api/user/feedback/:sid', isWxLogin, c.user.feedback);

  const reviweMiddlewares = [isWxLogin, checkRole(CADMIN), prereview];
  router.post('/api/user/apply/:sid', isWxLogin, c.register.applyFor);
  router.get('/api/user/apply/:sid', isWxLogin, c.register.applyInfo);

  router.get('/api/user/reviewcount/:sid', isWxLogin, checkRole(CADMIN), c.register.reviewCount);
  router.get('/api/user/reviewlist/:sid', isWxLogin, checkRole(CADMIN), c.register.reviewList);
  router.get('/api/user/reviewhistory/:sid', isWxLogin, checkRole(CADMIN), c.register.reviewHistory);
  router.get('/api/user/review/:sid/:uid', ...reviweMiddlewares, c.register.reviewInfo);
  router.post('/api/user/review/:sid/:uid', isWxLogin, checkRole(CADMIN), c.register.review);

  router.get('/api/doctor/doctors/:sid', isWxLogin, c.doctor.doctors);
  router.post('/api/doctor/booking/:sid', isWxLogin, checkRole(XIAOYOU), c.doctor.book);
  router.get('/api/doctor/booking/:sid/:bid', isWxLogin, checkRole(XIAOYOU), c.doctor.mybooking);
  router.get('/api/doctor/booking/:sid', isWxLogin, checkRole(XIAOYOU), c.doctor.mybookings);
  router.post('/api/doctor/booking/rebook/:sid/:bid', isWxLogin, checkRole(XIAOYOU), c.doctor.rebook);
  router.post('/api/doctor/booking/cancel/:sid/:bid', isWxLogin, checkRole(XIAOYOU), c.doctor.cancel);

  router.get('/api/doctor/admin/booking/count/undone/:sid', isWxLogin, checkRole(ADMIN), c.doctor.countUndone);
  router.get('/api/doctor/admin/booking/:sid/:bid', isWxLogin, checkRole(ADMIN), c.doctor.querybooking);
  router.get('/api/doctor/admin/booking/:sid', isWxLogin, checkRole(ADMIN), c.doctor.querybookings);
  router.post('/api/doctor/admin/booking/:sid/:bid', isWxLogin, checkRole(ADMIN), c.doctor.updatebooking);

  router.get('/api/query/hgetall/:pattern', authtoken, c.home.phgetall);
  router.get('/api/query/get/:pattern', authtoken, c.home.pget);
};
