import type { Result } from '@/types/result'
import {
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined
} from '@ant-design/icons'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  App,
  Badge,
  Button,
  DatePicker,
  Form,
  Input,
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
import dayjs from 'dayjs'
import type {
  AssistantAdminResponse,
  SearchAssistantAdminRequest,
  UpdateAssistantAdminRequest
} from '@/types/assistant'
import {
  createAssistant,
  deleteAssistant,
  searchAssistants,
  updateAssistant
} from '@/api/admin/assistant'

const orderMap = {
  ascend: 'asc',
  descend: 'desc'
}

type DataIndex = keyof AssistantAdminResponse

export default function Assistant(): React.JSX.Element {
  const { t } = useTranslation('assistant')
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
  const queryClient = useQueryClient()

  const { data, isFetching, refetch } = useQuery({
    queryKey: ['assistants', pageIndex, pageSize, sortField, sortOrder, searchColumn, searchText],
    queryFn: () =>
      searchAssistants(pageIndex, pageSize, sortField, sortOrder, {
        [searchColumn]: searchText
      } as SearchAssistantAdminRequest),
    placeholderData: keepPreviousData
  })

  const { list, total } = data?.data ?? {}
  const selectRowItem = list?.find((item) => item.id === selectedRowKey)

  const createAssistantMutation = useMutation({
    mutationFn: createAssistant,
    onSuccess: () => {
      message.success(t('assistantCreated'))
      setCreateModalOpen(false)
      queryClient.invalidateQueries({ queryKey: ['assistants'] })
    }
  })

  const updateAssistantMutation = useMutation<
    Result<void>,
    Error,
    { id: string; data: UpdateAssistantAdminRequest }
  >({
    mutationFn: ({ id, data }) => updateAssistant(id, data),
    onSuccess: () => {
      message.success(t('assistantUpdated'))
      setUpdateModalOpen(false)
      queryClient.invalidateQueries({ queryKey: ['assistants'] })
    }
  })

  const deleteAssistantMutation = useMutation({
    mutationFn: deleteAssistant,
    onSuccess: () => {
      message.success(t('assistantDeleted'))
      setSelectedRowKey('')
      queryClient.invalidateQueries({ queryKey: ['assistants'] })
    }
  })

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

  const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<AssistantAdminResponse> => ({
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
  ): TableColumnType<AssistantAdminResponse> => ({
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

  const columns: TableProps<AssistantAdminResponse>['columns'] = [
    {
      title: t('id'),
      dataIndex: 'id',
      ellipsis: true,
      sorter: true,
      ...getColumnSearchProps('id')
    },
    {
      title: t('name'),
      dataIndex: 'name',
      sorter: true,
      ...getColumnSearchProps('name')
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
      title: t('personality'),
      dataIndex: 'personality',
      ellipsis: true,
      sorter: true,
      ...getColumnSearchProps('personality')
    },
    {
      title: t('detail'),
      dataIndex: 'detail',
      ellipsis: true,
      sorter: true,
      ...getColumnSearchProps('detail')
    },
    {
      title: t('modelId'),
      dataIndex: 'modelId',
      ellipsis: true,
      sorter: true,
      ...getColumnSearchProps('modelId')
    },
    {
      title: t('creatorId'),
      dataIndex: 'creatorId',
      ellipsis: true,
      sorter: true,
      ...getColumnSearchProps('creatorId')
    },
    {
      title: t('ownerId'),
      dataIndex: 'ownerId',
      ellipsis: true,
      sorter: true,
      ...getColumnSearchProps('ownerId')
    },
    {
      title: t('publicFlag'),
      dataIndex: 'publicFlag',
      ...getColumnFilterProps('publicFlag', [
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
            onClick={() => setUpdateModalOpen(true)}
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
            onClick={() => deleteAssistantMutation.mutate(selectedRowKey)}
          />
        </Tooltip>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-style">
        <Table<AssistantAdminResponse>
          rowKey="id"
          columns={columns}
          dataSource={list}
          loading={{ spinning: isFetching, indicator: <LoadingOutlined spin /> }}
          rowSelection={{
            type: 'radio',
            selectedRowKeys: [selectedRowKey],
            onChange: (selectedRowKeys) => setSelectedRowKey(selectedRowKeys[0].toString())
          }}
          pagination={false}
          onChange={(_, __, sorter) => {
            const s = sorter as SorterResult<AssistantAdminResponse>
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
          showSearch: false
        }}
      />
      <Modal
        title={t('create')}
        open={createModalOpen}
        onCancel={() => {
          setCreateModalOpen(false)
        }}
        centered
        destroyOnHidden
        footer={null}
      >
        <div className="py-2 flex flex-col items-center gap-4">
          <Form
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            labelAlign="left"
            className="w-full"
            validateMessages={{ required: t('requiredTemplate', { label: '${label}' }) }}
            onFinish={async (values) => {
              createAssistantMutation.mutate({
                ...values,
                birthday: values.birthday?.format('YYYY-MM-DD') ?? undefined
              })
            }}
          >
            <Form.Item name="name" label={t('name')} rules={[{ required: true }]}>
              <Input />
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
            <Form.Item name="personality" label={t('personality')}>
              <Input />
            </Form.Item>
            <Form.Item name="detail" label={t('detail')}>
              <Input.TextArea />
            </Form.Item>
            <Form.Item name="modelId" label={t('modelId')} rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="creatorId" label={t('creatorId')} rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="ownerId" label={t('ownerId')} rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="publicFlag" label={t('publicFlag')} rules={[{ required: true }]}>
              <Switch />
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
        }}
        centered
        destroyOnHidden
        footer={null}
      >
          <Form
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            labelAlign="left"
            className="w-full py-2"
            initialValues={{
              ...selectRowItem,
              birthday: selectRowItem?.birthday ? dayjs(selectRowItem.birthday) : undefined
            }}
            onFinish={async (values) => {
              updateAssistantMutation.mutate({
                id: selectedRowKey,
                data: {
                  ...values,
                  birthday: values.birthday?.format('YYYY-MM-DD') ?? undefined,
                  version: selectRowItem?.version
                }
              })
            }}
          >
            <Form.Item name="name" label={t('name')} rules={[{ required: true }]}>
              <Input />
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
            <Form.Item name="personality" label={t('personality')}>
              <Input />
            </Form.Item>
            <Form.Item name="detail" label={t('detail')}>
              <Input.TextArea />
            </Form.Item>
            <Form.Item name="modelId" label={t('modelId')} rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="creatorId" label={t('creatorId')} rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="ownerId" label={t('ownerId')} rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="publicFlag" label={t('publicFlag')} rules={[{ required: true }]}>
              <Switch />
            </Form.Item>
            <Form.Item name="deleteFlag" label={t('deleteFlag')} rules={[{ required: true }]}>
              <Switch />
            </Form.Item>
            <Button type="primary" htmlType="submit" block>
              {t('update')}
            </Button>
          </Form>
      </Modal>
    </div>
  )
}
