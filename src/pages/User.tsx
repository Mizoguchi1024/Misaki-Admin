import { createUser, deleteUser, searchUsers, updateUser } from '@/api/admin/user'
import ImageUpload from '@/components/common/ImageUpload'
import type { UploadResponse } from '@/types/common'
import type { Result } from '@/types/result'
import type {
  SearchUserAdminRequest,
  UpdateUserAdminRequest,
  UserAdminResponse
} from '@/types/user'
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  UserOutlined
} from '@ant-design/icons'
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
  Radio,
  Select,
  Switch,
  Table,
  Tooltip,
  type InputRef,
  type TableColumnType,
  type TableProps
} from 'antd'
import type { ColumnFilterItem, FilterDropdownProps, SorterResult } from 'antd/es/table/interface'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Highlighter from 'react-highlight-words'
import { getProfile } from '@/api/front/user'
import dayjs from 'dayjs'

const orderMap = {
  ascend: 'asc',
  descend: 'desc'
}

type DataIndex = keyof UserAdminResponse

export default function User(): React.JSX.Element {
  const { t } = useTranslation('user')
  const { message } = App.useApp()
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sortField, setSortField] = useState<string | undefined>('id')
  const [sortOrder, setSortOrder] = useState<string | undefined>('asc')
  const [selectedRowKey, setSelectedRowKey] = useState('')
  const [searchColumn, setSearchColumn] = useState('')
  const [searchText, setSearchText] = useState('')
  const searchInput = useRef<InputRef>(null)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [updateModalOpen, setUpdateModalOpen] = useState(false)
  const [avatarPath, setAvatarPath] = useState('')
  const queryClient = useQueryClient()
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['users', pageIndex, pageSize, sortField, sortOrder, searchColumn, searchText],
    queryFn: () =>
      searchUsers(pageIndex, pageSize, sortField, sortOrder, {
        [searchColumn]: searchText
      } as SearchUserAdminRequest)
  })

  const { list, total } = data?.data ?? {}
  const selectRowItem = list?.find((item) => item.id === selectedRowKey)

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile
  })

  const { id: userId } = profile?.data ?? {}

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      message.success(t('userCreated'))
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

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: DataIndex
  ) => {
    confirm()
    setSearchColumn(dataIndex)
    setSearchText(selectedKeys[0])
  }

  const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<UserAdminResponse> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div className="p-2 flex flex-col items-center" onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={t('searchField', { field: t(dataIndex) })}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          className="block mb-2 field-sizing-content"
        />
        <div className="w-full flex justify-between gap-2">
          <Button
            onClick={() => {
              clearFilters?.()
              setSelectedKeys([])
              confirm()
              setSearchColumn('')
              setSearchText('')
            }}
          >
            {t('clear')}
          </Button>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          >
            {t('search')}
          </Button>
        </div>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#3142EF' : undefined }} />
    ),
    filterDropdownProps: {
      onOpenChange(open) {
        if (open) {
          setTimeout(() => searchInput.current?.select(), 100)
        }
      }
    },
    render: (text) =>
      searchColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      )
  })

  const getColumnFilterProps = (
    dataIndex: DataIndex,
    filterItems: ColumnFilterItem[]
  ): TableColumnType<UserAdminResponse> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div className="p-2 flex flex-col items-center" onKeyDown={(e) => e.stopPropagation()}>
        <Radio.Group
          optionType="button"
          buttonStyle="solid"
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys([e.target.value])}
          className="mb-2"
        >
          {filterItems.map((item) => (
            <Radio key={item.value.toString()} value={item.value}>
              {item.text}
            </Radio>
          ))}
        </Radio.Group>
        <div className="w-full flex justify-between gap-2">
          <Button
            onClick={() => {
              clearFilters?.()
              setSelectedKeys([])
              confirm()
              setSearchColumn('')
              setSearchText('')
            }}
          >
            {t('clear')}
          </Button>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          >
            {t('filter')}
          </Button>
        </div>
      </div>
    ),
    filterMultiple: false,
    filters: filterItems
  })

  const columns: TableProps<UserAdminResponse>['columns'] = [
    {
      title: t('id'),
      dataIndex: 'id',
      ellipsis: true,
      sorter: true,
      ...getColumnSearchProps('id')
    },
    {
      title: t('authRole'),
      dataIndex: 'authRole',
      sorter: true,
      ...getColumnFilterProps('authRole', [
        { text: t('user'), value: 0 },
        { text: t('admin'), value: 1 }
      ]),
      render: (authRole) => AuthRoleMap[authRole]
    },
    {
      title: t('avatar'),
      dataIndex: 'avatarPath',
      render: (avatarPath) => (
        <Avatar
          src={'http://localhost:9000' + avatarPath}
          icon={<UserOutlined />}
          draggable={false}
          className="select-none"
        />
      )
    },
    {
      title: t('email'),
      dataIndex: 'email',
      ellipsis: true,
      sorter: true,
      ...getColumnSearchProps('email')
    },
    {
      title: t('username'),
      dataIndex: 'username',
      sorter: true,
      ...getColumnSearchProps('username')
    },
    {
      title: t('gender'),
      dataIndex: 'gender',
      sorter: true,
      ...getColumnFilterProps('gender', [
        { text: t('unknown'), value: 0 },
        { text: t('male'), value: 1 },
        { text: t('female'), value: 2 }
      ]),
      render: (gender) => GenderMap[gender]
    },
    {
      title: t('birthday'),
      dataIndex: 'birthday',
      sorter: true,
      ...getColumnSearchProps('birthday')
    },
    {
      title: t('occupation'),
      dataIndex: 'occupation',
      ellipsis: true,
      sorter: true,
      ...getColumnSearchProps('occupation')
    },
    {
      title: t('detail'),
      dataIndex: 'detail',
      ellipsis: true,
      sorter: true,
      ...getColumnSearchProps('detail')
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
      ...getColumnFilterProps('deletePendingFlag', [
        { text: t('false'), value: false },
        { text: t('true'), value: true }
      ]),
      render: (deletePendingFlag) =>
        deletePendingFlag ? <Badge status="success" /> : <Badge status="default" />
    },
    {
      title: t('deleteFlag'),
      dataIndex: 'deleteFlag',
      ...getColumnFilterProps('deleteFlag', [
        { text: t('false'), value: false },
        { text: t('true'), value: true }
      ]),
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
    <div className="h-full w-full flex flex-col items-center gap-4 py-4 px-8">
      <div className="flex items-center justify-start gap-4">
        <Tooltip
          title={t('refresh')}
          arrow={false}
          classNames={{
            container: 'select-none'
          }}
        >
          <Button
            variant="filled"
            color="default"
            shape="circle"
            icon={<ReloadOutlined />}
            onClick={() => {
              setSelectedRowKey('')
              refetch().then(() => message.success(t('refreshed')))
            }}
          />
        </Tooltip>
        <Tooltip
          title={t('create')}
          arrow={false}
          classNames={{
            container: 'select-none'
          }}
        >
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
        </Tooltip>
        <Tooltip
          title={t('update')}
          arrow={false}
          classNames={{
            container: 'select-none'
          }}
        >
          <Button
            variant="filled"
            color="blue"
            shape="circle"
            disabled={!selectedRowKey}
            icon={<EditOutlined />}
            onClick={() => {
              if (selectRowItem?.id === userId) {
                message.warning(t('cannotUpdateYourself'))
                return
              }
              setAvatarPath(selectRowItem?.avatarPath ?? '')
              setUpdateModalOpen(true)
            }}
          />
        </Tooltip>
        <Tooltip
          title={t('delete')}
          arrow={false}
          classNames={{
            container: 'select-none'
          }}
        >
          <Button
            variant="filled"
            color="red"
            shape="circle"
            disabled={!selectedRowKey}
            icon={<DeleteOutlined />}
            onClick={() => {
              if (selectRowItem?.id === userId) {
                message.warning(t('cannotDeleteYourself'))
                return
              }
              deleteUserMutation.mutate(selectedRowKey)
            }}
          />
        </Tooltip>
        <div>
          {pageIndex +
            ',' +
            pageSize +
            ',' +
            sortField +
            ',' +
            sortOrder +
            ',' +
            selectedRowKey +
            ',' +
            searchColumn +
            ',' +
            searchText}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-style">
        <Table<UserAdminResponse>
          rowKey="id"
          columns={columns}
          dataSource={list}
          loading={isLoading}
          rowSelection={{
            type: 'radio',
            selectedRowKeys: [selectedRowKey],
            onChange: (selectedRowKeys) => setSelectedRowKey(selectedRowKeys[0].toString())
          }}
          pagination={false}
          onChange={(_, __, sorter) => {
            const s = sorter as SorterResult<UserAdminResponse>
            setSortField((s.field ?? 'id').toString())
            setSortOrder(orderMap[s.order ?? 'ascend'])
          }}
          classNames={{
            header: {
              wrapper: 'sticky top-0 z-10',
              cell: 'select-none'
            }
          }}
        />
      </div>
      <Pagination
        current={pageIndex}
        onChange={(page, pageSize) => {
          setPageIndex(page)
          setPageSize(pageSize)
        }}
        pageSize={pageSize}
        total={total}
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
        onCancel={() => {
          setCreateModalOpen(false)
          setAvatarPath('')
        }}
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
              createUserMutation.mutate({
                ...values,
                avatarPath: avatarPath || undefined,
                birthday: values.birthday?.format('YYYY-MM-DD') ?? undefined
              })
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
              <DatePicker
                placeholder={t('birthday')}
                format="YYYY-MM-DD"
                disabledDate={(current) => current && current > dayjs().endOf('day')}
              />
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
        onCancel={() => {
          setUpdateModalOpen(false)
          setAvatarPath('')
        }}
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
            initialValues={{
              ...selectRowItem,
              birthday: selectRowItem?.birthday ? dayjs(selectRowItem.birthday) : undefined
            }}
            onFinish={async (values) => {
              updateUserMutation.mutate({
                id: selectedRowKey,
                data: {
                  ...values,
                  avatarPath: avatarPath || undefined,
                  birthday: values.birthday?.format('YYYY-MM-DD') ?? undefined,
                  version: selectRowItem?.version
                }
              })
            }}
          >
            <Form.Item name="authRole" label={t('authRole')} rules={[{ required: true }]}>
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
            <Form.Item name="password" label={t('password')}>
              <Input.Password placeholder={t('newPassword')} />
            </Form.Item>
            <Form.Item name="gender" label={t('gender')} rules={[{ required: true }]}>
              <Select
                options={[
                  { value: 0, label: t('unknown') },
                  { value: 1, label: t('male') },
                  { value: 2, label: t('female') }
                ]}
              />
            </Form.Item>
            <Form.Item name="birthday" label={t('birthday')}>
              <DatePicker
                placeholder={t('birthday')}
                format="YYYY-MM-DD"
                disabledDate={(current) => current && current > dayjs().endOf('day')}
              />
            </Form.Item>
            <Form.Item name="occupation" label={t('occupation')}>
              <Input />
            </Form.Item>
            <Form.Item name="detail" label={t('detail')}>
              <Input.TextArea />
            </Form.Item>
            <div className="flex justify-between">
              <Form.Item name="token" label={t('token')} layout="vertical" labelCol={{ span: 24 }}>
                <InputNumber />
              </Form.Item>
              <Form.Item
                name="crystal"
                label={t('crystal')}
                layout="vertical"
                labelCol={{ span: 24 }}
              >
                <InputNumber />
              </Form.Item>
              <Form.Item
                name="puzzle"
                label={t('puzzle')}
                layout="vertical"
                labelCol={{ span: 24 }}
              >
                <InputNumber />
              </Form.Item>
              <Form.Item
                name="stardust"
                label={t('stardust')}
                layout="vertical"
                labelCol={{ span: 24 }}
              >
                <InputNumber />
              </Form.Item>
            </div>
            <Form.Item name="deletePendingFlag" label={t('deletePendingFlag')}>
              <Switch />
            </Form.Item>
            <Form.Item name="deleteFlag" label={t('deleteFlag')}>
              <Switch />
            </Form.Item>
            <Button type="primary" htmlType="submit" block>
              {t('update')}
            </Button>
          </Form>
        </div>
      </Modal>
    </div>
  )
}
