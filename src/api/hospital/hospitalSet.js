import request from '@/utils/request'

export default {
  // 查询医院列表
  getHospitalSetList(current, limit, searchObj) {
    return request({
      url: `/admin/hosp/hospitalSet/findPageHospitalSet/${current}/${limit}`,
      method: 'POST',
      data: searchObj // 参数
    })
  },
  // 根据id删除医院设置
  removeHospitalSetById(id) {
    return request({
      url: `/admin/hosp/hospitalSet/${id}`,
      method: 'Delete'
    })
  },
  // 批量删除
  removeHospitalSetByIds(ids) {
    return request({
      url: `/admin/hosp/hospitalSet/batchRemove`,
      method: 'Delete',
      data: ids
    })
  },
  // 锁定与解锁
  lockHospitalSetById(id, status) {
    return request({
      url: `/admin/hosp/hospitalSet/lockHospitalSet/${id}/${status}`,
      method: 'Put'
    })
  },
  // 新增医院设置
  saveHospitalSet(hospitalSet) {
    return request({
      url: `/admin/hosp/hospitalSet/saveHospitalSet`,
      method: 'Post',
      data: hospitalSet
    })
  },
  // 根据id查询医院设置
  getHospitalSetById(id) {
    return request({
      url: `/admin/hosp/hospitalSet/getHospitalSet/${id}`,
      method: 'Get'
    })
  },
  // 修改医院设置
  updateHospitalSet(hospitalSet) {
    return request({
      url: `/admin/hosp/hospitalSet/updateHospitalSet`,
      method: 'Post',
      data: hospitalSet
    })
  }
}
