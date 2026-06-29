import { ViolationRule } from '../app/components/admin/CardViolationRules';
import { authFetch } from '../utils/apiHelper';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5173/api/v1';

class ViolationRuleService {
    async getAllRules(): Promise<ViolationRule[]> {
        const response = await authFetch(`${API_URL}/violation-rules`);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Lỗi khi lấy danh sách luật vi phạm');
        }
        return response.json();
    }

    async updateRule(ruleId: string, rule: ViolationRule): Promise<ViolationRule> {
        const response = await authFetch(`${API_URL}/violation-rules/${ruleId}`, {
            method: 'PUT',
            body: JSON.stringify(rule)
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Lỗi khi cập nhật luật vi phạm');
        }
        return response.json();
    }
}

export default new ViolationRuleService();
