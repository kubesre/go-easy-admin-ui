import {getUserMenuList} from "@/api/system/user";


const GetRouterList = () => {
  getUserMenuList().then(res => {
    console.log(res.data.menus)
  })
}

// eslint-disable-next-line import/prefer-default-export
export {GetRouterList}