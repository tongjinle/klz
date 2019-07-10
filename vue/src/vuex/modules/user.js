

const user={
  state: {
    name: localStorage.name,
    roleType: localStorage.roleType,
    companyId: localStorage.companyId,
    funId: '',
    funCode: '',
    childFunId: '',
    userId: localStorage.userId,
    sysUsempid: localStorage.sysUsempid,
    tk:'',
    status:true,
    commonFlag: false,
  },
  mutations: {
    setEmpIdd(state, param) {
      state.sysUsempid = param
      localStorage.sysUsempid = state.sysUsempid
    },
    setUserId(state, param) {
      state.userId = param
      localStorage.userId = state.userId
    },
    setCompanyId(state, param) {
      state.companyId = param
      localStorage.companyId = state.companyId
    },
    setName(state, param) {
      state.name = param
      localStorage.name = state.name
    },
    setFunId(state, param) {
      state.funId = param
    },
    setFunCode(state, param) {
      state.funCode = param
    },
    setRoleType(state, param) {
      state.roleType = param
      localStorage.roleType = state.roleType
    },
    setChildFunId(state, param) {
      state.childFunId = param
    },
    setTk (value) {
      state.tk = value
    },
    setStatus (value) {
      state.status = value
    },
    setCommonFlag(value) {
      state.commonFlag = value
    }
  },
}

export default user
