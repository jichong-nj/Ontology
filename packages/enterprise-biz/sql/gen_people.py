#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""确定性生成 8 大部门 + 100 人员 的 enterprise_biz 样例数据片段。
保留已存在的 6 个部门(1-6) 与 12 名人员(1-12)，追加部门与人员至目标规模。
本脚本只生成"新增"部分（emp_id 从 13 开始），总数控制在 100 人。
"""
import datetime
import random

# ---------------- 部门规划 ----------------
# 一级大部门 8 个: 总部(1) / 研发中心(2) / 生产制造(3) / 市场(4) [已存在]
#   + 销售部(11) / 人力资源部(14) / 财务部(15) / 质量部(16) [新增一级]
# 二级子组挂在一级部门下。
# (id, code, name, parent_id, location) -- id<=6 视为已存在，跳过插入
new_departments = [
    (7,  'D21', '产线一组',   3, '苏州'),
    (8,  'D22', '产线二组',   3, '苏州'),
    (9,  'D31', '品牌组',     4, '上海'),
    (10, 'D32', '渠道组',     4, '上海'),
    (11, 'D04', '销售部',     None, '上海'),
    (12, 'D41', '华东大区',   11, '上海'),
    (13, 'D42', '华南大区',   11, '广州'),
    (14, 'D05', '人力资源部', None, '南京'),
    (15, 'D06', '财务部',     None, '南京'),
    (16, 'D07', '质量部',     None, '苏州'),
]

# 每个部门(含已存在)的"负责人 emp_id"，用于回填 department.manager_id 与员工 manager。
# 已存在部门 1-6 的负责人沿用 seed.sql (1,2,3,4,5,8)。
dept_lead = {
    1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 8,
    # 新增部门负责人由脚本在生成时填充(见下)
}

# ---------------- 人员规划（仅新增，目标新增 88 人，总计 100） ----------------
# (dept_id, add_count, lead_title, staff_titles)
new_units = [
    (1,  2, '总裁办主任', ['行政助理', '行政助理']),                 # 总部: 共3
    (2,  4, '首席架构师', ['高级工程师', '高级工程师', '技术专家']),  # 研发中心: 共5
    (5,  7, '软件组长',   ['软件工程师', '软件工程师', '初级工程师', '测试工程师', '前端工程师', '后端工程师']),  # 软件组: 共10
    (6,  7, '硬件组长',   ['硬件工程师', '硬件工程师', 'FPGA工程师', '嵌入式工程师', '测试工程师', '结构工程师']),  # 硬件组: 共9
    (3,  3, '工艺总监',   ['工艺工程师', '生产计划员', '设备工程师']),  # 生产制造部: 共5
    (7,  8, '产线主管',   ['产线工人', '产线工人', '设备操作员', '班组长', '质检员', '维修工', '仓储员', '物流员']),  # 产线一组: 共8
    (8,  8, '产线主管',   ['产线工人', '产线工人', '设备操作员', '班组长', '质检员', '维修工', '仓储员', '物流员']),  # 产线二组: 共8
    (4,  2, '市场总监',   ['市场专员', '活动策划']),                  # 市场部: 共4
    (9,  5, '品牌经理',   ['文案策划', '视觉设计师', '媒介投放', '内容运营', '数据分析']),  # 品牌组: 共5
    (10, 5, '渠道经理',   ['渠道专员', '客户经理', '大客户主管', '电商运营', '区域代理']),  # 渠道组: 共5
    (11, 4, '销售总监',   ['大客户经理', '销售代表', '售前顾问', '销售运营']),  # 销售部: 共4
    (12, 7, '大区经理',   ['销售代表', '销售代表', '售前顾问', '售后工程师', '客户经理', '渠道经理', '数据分析']),  # 华东: 共7
    (13, 6, '大区经理',   ['销售代表', '销售代表', '售后工程师', '客户经理', '渠道经理', '市场推广']),  # 华南: 共6
    (14, 6, 'HR经理',     ['招聘专员', '薪酬专员', '培训专员', '员工关系', 'HRBP', '猎头顾问']),  # HR: 共6
    (15, 7, '财务经理',   ['会计', '出纳', '财务分析师', '税务专员', '审计专员', '成本会计', '资金专员']),  # 财务: 共7
    (16, 7, '质量经理',   ['质量工程师', '体系审核员', '检验员', '实验室工程师', '供应商质量', '客户质量', '计量员']),  # 质量: 共7
]

SURNAMES = ['王','李','张','刘','陈','杨','赵','黄','周','吴','徐','孙','马','朱','胡','林','郭','何','高','罗','郑','梁','谢','宋','唐','许','韩','冯','邓','曹','彭','曾','萧','田','董','袁','潘','于','蒋','蔡','余','杜','叶','程','苏','魏','吕','丁','任','沈','姚','卢','傅','钟','姜','崔','谭','廖','范','汪','陆','石','戴','贾','韦','夏','邱','方','侯','邹','熊','孟','秦','白','江','阎','薛','尹','段','雷','黎','史','龙','陶','贺','顾','毛','郝','龚','邵','万','钱','严','覃','武','莫','孔','向','汤']
GIVEN = ['伟','芳','娜','敏','静','丽','强','磊','军','洋','勇','艳','杰','娟','涛','明','超','秀英','霞','平','刚','桂英','建华','文','辉','力','俊','晨','宇','浩','婷','倩','璐','彤','鑫','斌','波','悦','嘉','欣','睿','泽','宁','航','轩','萱','瑞','佳','阳','雪','月','辰','逸','凡','思','雨','嘉怡','子涵','一鸣','嘉树']

GENDER_POOL = ['M', 'F']
STATUS_POOL = ['active', 'active', 'active', 'active', 'active', 'active', 'active', 'leave', 'dimission']
STATUS_POOL_DEPT = ['active', 'active', 'active', 'active', 'active', 'active', 'leave', 'dimission']

LOCATION_BY_DEPT = {
    1: '南京', 2: '南京', 3: '苏州', 4: '上海', 5: '南京', 6: '南京',
    7: '苏州', 8: '苏州', 9: '上海', 10: '上海', 11: '上海', 12: '上海',
    13: '广州', 14: '南京', 15: '南京', 16: '苏州',
}

def make_name(idx):
    s = SURNAMES[idx % len(SURNAMES)]
    g = GIVEN[(idx // 3) % len(GIVEN)]
    return s + g

def work_hours_for(title, seed):
    r = random.Random(seed)
    if r.random() < 0.13:
        return round(r.uniform(4.0, 6.5), 1)
    return round(r.uniform(7.0, 9.8), 1)

employees = []  # (id, code, name, gender, email, phone, title, dept_id, hire_date, work_hours, status)
emp_id = 13
name_idx = 0
base_date = datetime.date(2015, 1, 1)

for (dept_id, count, lead_title, staff_titles) in new_units:
    unit_start = emp_id
    for i in range(count):
        rng = random.Random(emp_id * 100 + i)
        gender = rng.choice(GENDER_POOL)
        name = make_name(name_idx); name_idx += 1
        title = lead_title if i == 0 else rng.choice(staff_titles)
        hire = base_date + datetime.timedelta(days=rng.randint(0, 4200))
        wh = work_hours_for(title, emp_id * 7 + i)
        status = rng.choice(STATUS_POOL)
        code = f'E{emp_id:04d}'
        email = f'{name}@{["corp","enterprise","group"][emp_id % 3]}.com'
        phone = f'138{emp_id:08d}'
        employees.append((emp_id, code, name, gender, email, phone, title, dept_id, hire.isoformat(), wh, status))
        if i == 0:
            dept_lead[dept_id] = emp_id  # 单元负责人
        emp_id += 1

# ---------------- 输出 SQL ----------------
def sql_escape(s):
    return s.replace("'", "''")

lines = []
lines.append('-- ===== 追加部门（销售/HR/财务/质量 等一级 + 子组） =====')
lines.append('INSERT INTO department (id, code, name, parent_id, location) VALUES')
dep_vals = []
for (did, code, name, pid, loc) in new_departments:
    pid_sql = 'NULL' if pid is None else str(pid)
    dep_vals.append(f"  ({did}, '{code}', '{sql_escape(name)}', {pid_sql}, '{loc}')")
lines.append(',\n'.join(dep_vals))
lines.append('ON CONFLICT (id) DO NOTHING;')
lines.append('')

lines.append('-- ===== 追加人员（至 100 人） =====')
lines.append('INSERT INTO employee (id, emp_code, name, gender, email, phone, title, department_id, manager_id, hire_date, work_hours, status) VALUES')
emp_vals = []
for e in employees:
    (eid, code, name, gender, email, phone, title, dept, hire, wh, status) = e
    emp_vals.append(
        f"  ({eid}, '{code}', '{sql_escape(name)}', '{gender}', '{sql_escape(email)}', '{phone}', "
        f"'{sql_escape(title)}', {dept}, NULL, '{hire}', {wh}, '{status}')"
    )
lines.append(',\n'.join(emp_vals))
lines.append('ON CONFLICT (id) DO NOTHING;')
lines.append('')

lines.append('-- ===== 回填人员直属上级 (manager_id) =====')
# 单元负责人 -> 其部门父链的负责人（递归向上找 dept_lead）
# 构建 parent 映射
parent_of = {did: pid for (did, code, name, pid, loc) in new_departments}
parent_of.update({1: None, 2: 1, 3: 1, 4: 1, 5: 2, 6: 2})  # 已存在部门
def find_lead(dept_id):
    cur = dept_id
    seen = set()
    while cur is not None and cur not in seen:
        seen.add(cur)
        if cur in dept_lead:
            return dept_lead[cur]
        cur = parent_of.get(cur)
    return None

for e in employees:
    (eid, code, name, gender, email, phone, title, dept, hire, wh, status) = e
    if eid in dept_lead.values():
        # 是本单元负责人 -> 上级部门负责人
        mgr_target = find_lead(parent_of.get(dept))
    else:
        # 普通员工 -> 本单元负责人
        mgr_target = dept_lead.get(dept)
    if mgr_target is not None:
        lines.append(f"UPDATE employee SET manager_id = {mgr_target} WHERE id = {eid};")

lines.append('')
lines.append('-- ===== 回填新增部门负责人 =====')
for did, mgr in dept_lead.items():
    if did <= 6:
        continue
    lines.append(f"UPDATE department SET manager_id = {mgr} WHERE id = {did};")

lines.append('')
lines.append('-- 统计')
lines.append("SELECT 'departments', count(*) FROM department UNION ALL SELECT 'employees', count(*) FROM employee;")

print('\n'.join(lines))
