import type { Result } from '@/types/result'
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  InfoCircleOutlined,
  LoadingOutlined,
  ReloadOutlined,
  SearchOutlined,
  StopOutlined,
  SyncOutlined
} from '@ant-design/icons'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  App,
  Badge,
  Button,
  Form,
  Input,
  Modal,
  Pagination,
  Radio,
  Select,
  Switch,
  Table,
  Tag,
  Tooltip,
  type InputRef,
  type TableColumnType,
  type TableProps
} from 'antd'
import type { ColumnFilterItem, FilterDropdownProps, SorterResult } from 'antd/es/table/interface'
import { useRef, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import Highlighter from 'react-highlight-words'
import type {
  FeedbackAdminResponse,
  SearchFeedbackAdminRequest,
  UpdateFeedbackAdminRequest
} from '@/types/feedback'
import { deleteFeedback, searchFeedbacks, updateFeedback } from '@/api/admin/feedback'

const orderMap = {
  ascend: 'asc',
  descend: 'desc'
}

type DataIndex = keyof FeedbackAdminResponse

export default function Feedback(): React.JSX.Element {
  const { t } = useTranslation('feedback')
  const { message } = App.useApp()
  const [pageIndex, setPageIndex] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [sortField, setSortField] = useState<string | undefined>('id')
  const [sortOrder, setSortOrder] = useState<string | undefined>('asc')
  const [selectedRowKey, setSelectedRowKey] = useState('')
  const [searchColumn, setSearchColumn] = useState('')
  const [searchText, setSearchText] = useState('')
  const searchInput = useRef<InputRef>(null)
  const [updateModalOpen, setUpdateModalOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data, isFetching, refetch } = useQuery({
    queryKey: ['feedbacks', pageIndex, pageSize, sortField, sortOrder, searchColumn, searchText],
    queryFn: () =>
      searchFeedbacks(pageIndex, pageSize, sortField, sortOrder, {
        [searchColumn]: searchText
      } as SearchFeedbackAdminRequest),
    placeholderData: keepPreviousData
  })

  const { list, total } = data?.data ?? {}
  const selectRowItem = list?.find((item) => item.id === selectedRowKey)

  const updateFeedbackMutation = useMutation<
    Result<void>,
    Error,
    { id: string; data: UpdateFeedbackAdminRequest }
  >({
    mutationFn: ({ id, data }) => updateFeedback(id, data),
    onSuccess: () => {
      message.success(t('feedbackUpdated'))
      setUpdateModalOpen(false)
      queryClient.invalidateQueries({ queryKey: ['feedbacks'] })
    }
  })

  const deleteFeedbackMutation = useMutation({
    mutationFn: deleteFeedback,
    onSuccess: () => {
      message.success(t('feedbackDeleted'))
      setSelectedRowKey('')
      queryClient.invalidateQueries({ queryKey: ['feedbacks'] })
    }
  })

  const TypeMap: Record<number, string> = {
    0: t('bug'),
    1: t('task'),
    2: t('performance'),
    3: t('experience'),
    4: t('advice')
  }

  const StatusMap: Record<number, { text: string; color: string; icon: ReactNode }> = {
    0: { text: t('new'), color: 'blue', icon: <InfoCircleOutlined /> },
    1: { text: t('processing'), color: 'geekblue', icon: <SyncOutlined spin /> },
    2: { text: t('rejected'), color: 'red', icon: <CloseCircleOutlined /> },
    3: { text: t('resolved'), color: 'green', icon: <CheckCircleOutlined /> },
    4: { text: t('closed'), color: 'default', icon: <StopOutlined /> }
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

  const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<FeedbackAdminResponse> => ({
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
  ): TableColumnType<FeedbackAdminResponse> => ({
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

  const columns: TableProps<FeedbackAdminResponse>['columns'] = [
    {
      title: t('id'),
      dataIndex: 'id',
      ellipsis: true,
      sorter: true,
      ...getColumnSearchProps('id')
    },
    {
      title: t('userId'),
      dataIndex: 'userId',
      ellipsis: true,
      sorter: true,
      ...getColumnSearchProps('userId')
    },
    {
      title: t('replierId'),
      dataIndex: 'replierId',
      ellipsis: true,
      sorter: true,
      ...getColumnSearchProps('replierId')
    },
    {
      title: t('type'),
      dataIndex: 'type',
      sorter: true,
      ...getColumnFilterProps('type', [
        { text: TypeMap[0], value: 0 },
        { text: TypeMap[1], value: 1 },
        { text: TypeMap[2], value: 2 },
        { text: TypeMap[3], value: 3 },
        { text: TypeMap[4], value: 4 }
      ]),
      render: (type) => TypeMap[type]
    },
    {
      title: t('title'),
      dataIndex: 'title',
      ellipsis: true,
      sorter: true,
      ...getColumnSearchProps('title')
    },
    {
      title: t('content'),
      dataIndex: 'content',
      ellipsis: true,
      sorter: true,
      ...getColumnSearchProps('content')
    },
    {
      title: t('reply'),
      dataIndex: 'reply',
      ellipsis: true,
      sorter: true,
      ...getColumnSearchProps('reply')
    },
    {
      title: t('status'),
      dataIndex: 'status',
      sorter: true,
      ...getColumnFilterProps('status', [
        { text: StatusMap[0].text, value: 0 },
        { text: StatusMap[1].text, value: 1 },
        { text: StatusMap[2].text, value: 2 },
        { text: StatusMap[3].text, value: 3 },
        { text: StatusMap[4].text, value: 4 }
      ]),
      render: (status) => (
        <Tag color={StatusMap[status].color} icon={StatusMap[status].icon}>
          {StatusMap[status].text}
        </Tag>
      )
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
            onClick={() => deleteFeedbackMutation.mutate(selectedRowKey)}
          />
        </Tooltip>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-style">
        <Table<FeedbackAdminResponse>
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
            const s = sorter as SorterResult<FeedbackAdminResponse>
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
            ...selectRowItem
          }}
          onFinish={async (values) => {
            updateFeedbackMutation.mutate({
              id: selectedRowKey,
              data: {
                ...values,
                birthday: values.birthday?.format('YYYY-MM-DD') ?? undefined,
                version: selectRowItem?.version
              }
            })
          }}
        >
          <Form.Item name="replierId" label={t('replierId')}>
            <Input />
          </Form.Item>
          <Form.Item name="type" label={t('type')} rules={[{ required: true }]}>
            <Select
              options={[
                { text: TypeMap[0], value: 0 },
                { text: TypeMap[1], value: 1 },
                { text: TypeMap[2], value: 2 },
                { text: TypeMap[3], value: 3 },
                { text: TypeMap[4], value: 4 }
              ]}
            />
          </Form.Item>
          <Form.Item name="reply" label={t('reply')}>
            <Input />
          </Form.Item>
          <Form.Item name="status" label={t('status')} rules={[{ required: true }]}>
            <Select
              options={[
                { text: StatusMap[0].text, value: 0 },
                { text: StatusMap[1].text, value: 1 },
                { text: StatusMap[2].text, value: 2 },
                { text: StatusMap[3].text, value: 3 },
                { text: StatusMap[4].text, value: 4 }
              ]}
            />
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
