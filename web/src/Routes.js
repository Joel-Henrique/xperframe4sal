import { Routes, Route } from 'react-router-dom';
import { PrivateRoutes } from './PrivateRoutes';
import {
  Login,
  ICF,
  Tasks,
  Task,
  Contact,
  Surveys,
  Survey,
  Experiments,
  Register,
  ForgotPassword,
  NotFoundPage,
  Account,
  CreateTasks,
  CreateSurveys,
  ResetPassword,
  Instructions
} from './pages';


const Router = () => {
  return (
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/reset-password' element={<ResetPassword />} />
      <Route path='/forgot-password' element={<ForgotPassword />} />
      <Route path='/account' element={<PrivateRoutes />}>
        <Route index element={<Account />} />
      </Route>
      <Route path='/contact' element={<PrivateRoutes />}>
        <Route index element={<Contact />} />
      </Route>
      <Route path='/instructions' element={<PrivateRoutes />}>
        <Route index element={<Instructions />} />
      </Route>

      <Route path='/createtasks' element={<PrivateRoutes />}>
         <Route index element={<CreateTasks />} />
      </Route>

      <Route path='/CreateSurveys' element={<PrivateRoutes />}>
         <Route index element={<CreateSurveys />} />
      </Route>

      <Route path='/experiments' element={<PrivateRoutes />}>
        <Route index element={<Experiments />} />
        <Route path=':experimentId/icf' element={<ICF />} />
        <Route path=':experimentId/surveys' element={<Surveys />} />
        <Route path=':experimentId/surveys/:surveyId' element={<Survey />} />
        <Route path=':experimentId/tasks/' element={<Tasks />} />
        <Route path=':experimentId/tasks/:taskId' element={<Task />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export { Router };