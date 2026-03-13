import { searchUsers } from '@/api/admin/user'
import type { UserAdminResponse } from '@/types/user'
import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { Badge, Button, DatePicker, Form, Input, Select, Space, Table, type TableProps } from 'antd'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

export default function User(): React.JSX.Element {
  const { t } = useTranslation()
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sortField, setSortField] = useState('id')
  const [sortOrder, setSortOrder] = useState('asc')

  const { data, isLoading } = useQuery({
    queryKey: ['users', pageIndex, pageSize, sortField, sortOrder],
    queryFn: () => searchUsers(pageIndex, pageSize, sortField, sortOrder, {})
  })

  const { list, total } = data?.data ?? {}

  const AuthRoleMap = {
    [0]: t('user'),
    [1]: t('admin')
  }

  const GenderMap = {
    [0]: t('unknown'),
    [1]: t('male'),
    [2]: t('female')
  }

  const columns: TableProps['columns'] = [
    {
      title: t('id'),
      dataIndex: 'id'
    },
    {
      title: t('authRole'),
      dataIndex: 'authRole',
      render: (authRole) => AuthRoleMap[authRole]
    },
    {
      title: t('email'),
      dataIndex: 'email'
    },
    {
      title: t('username'),
      dataIndex: 'username'
    },
    {
      title: t('gender'),
      dataIndex: 'gender',
      render: (gender) => GenderMap[gender]
    },
    {
      title: t('birthday'),
      dataIndex: 'birthday'
    },
    {
      title: t('occupation'),
      dataIndex: 'occupation'
    },
    {
      title: t('detail'),
      dataIndex: 'detail'
    },
    {
      title: t('lastLoginTime'),
      dataIndex: 'lastLoginTime'
    },
    {
      title: t('lastCheckInDate'),
      dataIndex: 'lastCheckInDate'
    },
    {
      title: t('deletePendingFlag'),
      dataIndex: 'deletePendingFlag',
      render: (deletePendingFlag) =>
        deletePendingFlag ? <Badge status="success" /> : <Badge status="default" />
    },
    {
      title: t('deleteFlag'),
      dataIndex: 'deleteFlag',
      render: (deleteFlag) => (deleteFlag ? <Badge status="success" /> : <Badge status="default" />)
    },
    {
      title: t('updateTime'),
      dataIndex: 'updateTime'
    },
    {
      title: t('createTime'),
      dataIndex: 'createTime'
    },
    {
      title: t('action'),
      key: 'action',
      render: () => (
        <Space>
          <Button variant="filled" color="blue" shape="circle" icon={<EditOutlined />} />
          <Button variant="filled" color="red" shape="circle" icon={<DeleteOutlined />} />
        </Space>
      )
    }
  ]

  return (
    <div className="h-full w-full flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <Button variant="filled" color="green" shape="circle" icon={<PlusOutlined />} />
      </div>
      <Table<UserAdminResponse>
        columns={columns}
        dataSource={list}
        loading={isLoading}
        pagination={{ placement: ['bottomCenter'] }}
        classNames={{
          header: {
            cell: 'select-none'
          }
        }}
      />
    </div>
  )
}
