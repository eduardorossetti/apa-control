import type { DashboardRepository } from '@/repositories'
import type { DashboardResponse, GetDashboardStatsData } from './get-dashboard-stats.dto'

export class GetDashboardStatsUseCase {
  constructor(private dashboardRepository: DashboardRepository) {}

  async execute(data: GetDashboardStatsData): Promise<DashboardResponse> {
    const stats = await this.dashboardRepository.getStats()
    const monthlyStats = await this.dashboardRepository.getMonthlyStats(data.year || new Date().getFullYear())
    const financialStats = await this.dashboardRepository.getFinancialStats(data.year || new Date().getFullYear())

    return {
      stats,
      monthlyStats,
      financialStats,
    }
  }
}
