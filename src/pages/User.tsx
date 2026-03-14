import { createUser, deleteUser, searchUsers, updateUser } from '@/api/admin/user'
import ImageUpload from '@/components/common/ImageUpload'
import type { UploadResponse } from '@/types/common'
import type { Result } from '@/types/result'
import type { UpdateUserAdminRequest, UserAdminResponse } from '@/types/user'
import { DeleteOutlined, EditOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  App,
  Avatar,
  Badge,
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Pagination,
  Select,
  Switch,
  Table,
  type TableProps
} from 'antd'
import type { SorterResult } from 'antd/es/table/interface'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const orderMap = {
  ascend: 'asc',
  descend: 'desc'
}

export default function User(): React.JSX.Element {
  const { t } = useTranslation('user')
  const { message } = App.useApp()
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sortField, setSortField] = useState<string | undefined>('id')
  const [sortOrder, setSortOrder] = useState<string | undefined>('asc')
  const [selectedRowKey, setSelectedRowKey] = useState('')

  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [updateModalOpen, setUpdateModalOpen] = useState(false)
  const [avatarPath, setAvatarPath] = useState('')
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['users', pageIndex, pageSize, sortField, sortOrder],
    queryFn: () => searchUsers(pageIndex, pageSize, sortField, sortOrder, {})
  })

  const { list, total } = data?.data ?? {}
  const selectRowItem = list?.find((item) => item.id === selectedRowKey)

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      message.success(t('userCreated'))
      setAvatarPath('')
      setCreateModalOpen(false)
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })

  const updateUserMutation = useMutation<
    Result<void>,
    Error,
    { id: string; data: UpdateUserAdminRequest }
  >({
    mutationFn: ({ id, data }) => updateUser(id, data),
    onSuccess: () => {
      message.success(t('userUpdated'))
      setAvatarPath('')
      setUpdateModalOpen(false)
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      message.success(t('userDeleted'))
      setSelectedRowKey('')
      queryClient.invalidateQueries({ queryKey: ['users'] })
    }
  })

  const AuthRoleMap: Record<number, string> = {
    0: t('user'),
    1: t('admin')
  }

  const GenderMap: Record<number, string> = {
    0: t('unknown'),
    1: t('male'),
    2: t('female')
  }

  const columns: TableProps<UserAdminResponse>['columns'] = [
    {
      title: t('id'),
      dataIndex: 'id',
      sorter: true
    },
    {
      title: t('authRole'),
      dataIndex: 'authRole',
      sorter: true,
      render: (authRole) => AuthRoleMap[authRole]
    },
    {
      title: t('avatar'),
      dataIndex: 'avatarPath',
      render: (avatarPath) =>
        avatarPath ? (
          <Avatar
            src={'http://localhost:9000' + avatarPath}
            icon={<UserOutlined />}
            draggable={false}
            className="select-none"
          />
        ) : null
    },
    {
      title: t('email'),
      dataIndex: 'email',
      ellipsis: true,
      sorter: true
    },
    {
      title: t('username'),
      dataIndex: 'username',
      sorter: true,
      filterDropdown: true
    },
    {
      title: t('gender'),
      dataIndex: 'gender',
      sorter: true,
      render: (gender) => GenderMap[gender]
    },
    {
      title: t('birthday'),
      dataIndex: 'birthday',
      sorter: true
    },
    {
      title: t('occupation'),
      dataIndex: 'occupation',
      ellipsis: true,
      sorter: true
    },
    {
      title: t('detail'),
      dataIndex: 'detail',
      ellipsis: true,
      sorter: true
    },
    {
      title: t('lastLoginTime'),
      dataIndex: 'lastLoginTime',
      ellipsis: true,
      sorter: true
    },
    {
      title: t('lastCheckInDate'),
      dataIndex: 'lastCheckInDate',
      ellipsis: true,
      sorter: true
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
      dataIndex: 'updateTime',
      ellipsis: true,
      sorter: true
    },
    {
      title: t('createTime'),
      dataIndex: 'createTime',
      ellipsis: true,
      sorter: true
    }
  ]

  return (
    <div className="h-full w-full flex flex-col items-center gap-4 py-4 px-8 overflow-x-hidden overflow-y-auto scrollbar-style">
      <div className="flex items-center justify-start gap-4">
        <Button
          variant="filled"
          color="green"
          shape="circle"
          icon={<PlusOutlined />}
          onClick={() => {
            setSelectedRowKey('')
            setCreateModalOpen(true)
          }}
        />
        <Button
          variant="filled"
          color="blue"
          shape="circle"
          disabled={!selectedRowKey}
          icon={<EditOutlined />}
          onClick={() => {
            setAvatarPath(selectRowItem?.avatarPath ?? '')
            setUpdateModalOpen(true)
          }}
        />
        <Button
          variant="filled"
          color="red"
          shape="circle"
          disabled={!selectedRowKey}
          icon={<DeleteOutlined />}
          onClick={() => {
            deleteUserMutation.mutate(selectedRowKey)
          }}
        />
        <div>
          {pageIndex + ',' + pageSize + ',' + sortField + ',' + sortOrder + ',' + selectedRowKey}
        </div>
      </div>
      <Table<UserAdminResponse>
        rowKey="id"
        columns={columns}
        dataSource={list}
        loading={isLoading}
        scroll={{ y: 600 }}
        rowSelection={{
          type: 'radio',
          selectedRowKeys: [selectedRowKey],
          onChange: (selectedRowKeys) => setSelectedRowKey(selectedRowKeys[0].toString())
        }}
        pagination={false}
        className="flex-1"
        classNames={{
          header: {
            cell: 'select-none'
          },
          footer: 'flex items-center justify-center'
        }}
        onChange={(_, filters, sorter) => {
          const s = sorter as SorterResult<UserAdminResponse>
          setSortField((s.field ?? 'id').toString())
          setSortOrder(orderMap[s.order ?? 'ascend'])
        }}
      />
      <Pagination
        current={pageIndex}
        onChange={(page, pageSize) => {
          setPageIndex(page)
          setPageSize(pageSize)
        }}
        pageSize={pageSize}
        total={+(total ?? '0')}
        showTotal={(total, range) => `${range[0]}-${range[1]} / ${total}`}
        showSizeChanger={{
          options: [
            { value: 10, label: 10 },
            { value: 20, label: 20 },
            { value: 50, label: 50 },
            { value: 100, label: 100 }
          ],
          showSearch: false
        }}
      />
      <Modal
        title={t('create')}
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        centered
        destroyOnHidden
        footer={null}
      >
        <div className="py-2 flex flex-col items-center gap-4">
          <ImageUpload
            imgPath={avatarPath ?? ''}
            onSuccess={async (data: UploadResponse) => {
              setAvatarPath(data.path)
              message.success(t('uploadSuccess'))
            }}
          />
          <Form
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            labelAlign="left"
            className="w-full"
            validateMessages={{ required: t('requiredTemplate', { label: '${label}' }) }}
            onFinish={async (values) => {
              createUserMutation.mutate({ ...values, avatarPath: avatarPath || undefined })
            }}
          >
            <Form.Item
              name="authRole"
              label={t('authRole')}
              initialValue={0}
              rules={[{ required: true }]}
            >
              <Select
                options={[
                  { value: 0, label: t('user') },
                  { value: 1, label: t('admin') }
                ]}
              />
            </Form.Item>
            <Form.Item name="email" label={t('email')} rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="username" label={t('username')} rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="password" label={t('password')} rules={[{ required: true }]}>
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="gender"
              label={t('gender')}
              initialValue={0}
              rules={[{ required: true }]}
            >
              <Select
                options={[
                  { value: 0, label: t('unknown') },
                  { value: 1, label: t('male') },
                  { value: 2, label: t('female') }
                ]}
              />
            </Form.Item>
            <Form.Item name="birthday" label={t('birthday')}>
              <DatePicker />
            </Form.Item>
            <Form.Item name="occupation" label={t('occupation')}>
              <Input />
            </Form.Item>
            <Form.Item name="detail" label={t('detail')}>
              <Input.TextArea />
            </Form.Item>
            <Button type="primary" htmlType="submit" block>
              {t('create')}
            </Button>
          </Form>
        </div>
      </Modal>
      <Modal
        title={t('update')}
        open={updateModalOpen}
        onCancel={() => setUpdateModalOpen(false)}
        centered
        destroyOnHidden
        footer={null}
      >
        <div className="py-2 flex flex-col items-center gap-4">
          <ImageUpload
            imgPath={avatarPath ?? ''}
            onSuccess={async (data: UploadResponse) => {
              setAvatarPath(data.path)
              message.success(t('uploadSuccess'))
            }}
          />
          <Form
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            labelAlign="left"
            className="w-full"
            onFinish={async (values) => {
              updateUserMutation.mutate({
                id: selectedRowKey,
                data: {
                  ...selectRowItem,
                  ...values,
                  avatarPath: avatarPath || undefined
                }
              })
            }}
          >
            <Form.Item
              name="authRole"
              label={t('authRole')}
              initialValue={selectRowItem?.authRole}
              rules={[{ required: true }]}
            >
              <Select
                options={[
                  { value: 0, label: t('user') },
                  { value: 1, label: t('admin') }
                ]}
              />
            </Form.Item>
            <Form.Item
              name="email"
              label={t('email')}
              initialValue={selectRowItem?.email}
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="username"
              label={t('username')}
              initialValue={selectRowItem?.username}
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="password" label={t('password')}>
              <Input.Password placeholder={t('newPassword')} />
            </Form.Item>
            <Form.Item
              name="gender"
              label={t('gender')}
              initialValue={selectRowItem?.gender}
              rules={[{ required: true }]}
            >
              <Select
                options={[
                  { value: 0, label: t('unknown') },
                  { value: 1, label: t('male') },
                  { value: 2, label: t('female') }
                ]}
              />
            </Form.Item>
            <Form.Item name="birthday" label={t('birthday')}>
              <DatePicker />
            </Form.Item>
            <Form.Item
              name="occupation"
              label={t('occupation')}
              initialValue={selectRowItem?.occupation}
            >
              <Input />
            </Form.Item>
            <Form.Item name="detail" label={t('detail')} initialValue={selectRowItem?.detail}>
              <Input.TextArea />
            </Form.Item>
            <div className="flex justify-between">
              <Form.Item
                name="token"
                label={t('token')}
                initialValue={selectRowItem?.token}
                layout="vertical"
                labelCol={{ span: 24 }}
              >
                <InputNumber />
              </Form.Item>
              <Form.Item
                name="crystal"
                label={t('crystal')}
                initialValue={selectRowItem?.crystal}
                layout="vertical"
                labelCol={{ span: 24 }}
              >
                <InputNumber />
              </Form.Item>
              <Form.Item
                name="puzzle"
                label={t('puzzle')}
                initialValue={selectRowItem?.puzzle}
                layout="vertical"
                labelCol={{ span: 24 }}
              >
                <InputNumber />
              </Form.Item>
              <Form.Item
                name="stardust"
                label={t('stardust')}
                initialValue={selectRowItem?.stardust}
                layout="vertical"
                labelCol={{ span: 24 }}
              >
                <InputNumber />
              </Form.Item>
            </div>
            <div className="flex justify-between">
              <Form.Item
                name="deletePendingFlag"
                label={t('deletePendingFlag')}
                initialValue={selectRowItem?.deletePendingFlag}
              >
                <Switch />
              </Form.Item>
              <Form.Item
                name="deleteFlag"
                label={t('deleteFlag')}
                initialValue={selectRowItem?.deleteFlag}
              >
                <Switch />
              </Form.Item>
            </div>
            <Button type="primary" htmlType="submit" block>
              {t('update')}
            </Button>
          </Form>
        </div>
      </Modal>
    </div>
  )
}
