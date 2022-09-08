import {loginUser} from './login.service';
import {
  getAllComments,
  getAllTicketByCustomer,
  getAllTicketByPic,
  getTicketDetail,
  getTickets,
  updateStatus,
  postTicket,
  postComment,
  findByIdTicket,
} from './ticket.service';
import {
  getProfileCust,
  getProfileEmployee,
  getProfileCustById,
  getProfileEmpById,
  updateProfileCust,
  updateProfileEmp,
} from './profile.service';
import {getCompanies} from './company.service';
import {getProductByCust} from './product.service';
import {getPriorities} from './priority.service';
import {changePass} from './user.service'

export {
  changePass,
  findByIdTicket,
  postComment,
  postTicket,
  getPriorities,
  getProductByCust,
  updateProfileCust,
  updateProfileEmp,
  loginUser,
  getAllComments,
  getAllTicketByCustomer,
  getAllTicketByPic,
  getTicketDetail,
  getTickets,
  updateStatus,
  getProfileCust,
  getProfileEmployee,
  getCompanies,
  getProfileCustById,
  getProfileEmpById,
};
