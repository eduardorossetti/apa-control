import { authorize } from '@/http/middlewares/authorize'
import type { FastifyInstance } from 'fastify'
import { createEmployeeController } from './create-employee/create-employee.controller'
import { disableEmployeeController } from './disable-employee/disable-employee.controller'
import { getEmployeeByIdController } from './get-employee-by-id/get-employee-by-id.controller'
import { listEmployeesController } from './list-employees/list-employees.controller'
import { updateEmployeeController } from './update-employee/update-employee.controller'

export async function employeeRoutes(app: FastifyInstance) {
  app.post('/employee.add', authorize('AdminPanel', 'Employees'), createEmployeeController)
  app.put('/employee.update', authorize('AdminPanel', 'Employees'), updateEmployeeController)
  app.get('/employee.list', authorize('AdminPanel', 'Employees'), listEmployeesController)
  app.get('/employee.key/:id', authorize('AdminPanel', 'Employees'), getEmployeeByIdController)
  app.post('/employee.disable', authorize('AdminPanel', 'Employees'), disableEmployeeController)
}
