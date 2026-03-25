import { createModel, deleteModel, searchModels, updateModel } from '@/api/admin/model'
import ImageUpload from '@/components/common/ImageUpload'
import type { UploadResponse } from '@/types/common'
import type { Result } from '@/types/result'
import type {
  SearchModelAdminRequest,
  UpdateModelAdminRequest,
  ModelAdminResponse
} from '@/types/model'
import {
  DeleteOutlined,
  EditOutlined,
  LoadingOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  StarOutlined
} from '@ant-design/icons'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  App,
  Avatar,
  Badge,
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Pagination,
  Radio,
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

const orderMap = {
  ascend: 'asc',
  descend: 'desc'
}

type DataIndex = keyof ModelAdminResponse

export default function Model(): React.JSX.Element {
  const { t } = useTranslation('model')
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

  const { data, isFetching, refetch } = useQuery({
    queryKey: ['models', pageIndex, pageSize, sortField, sortOrder, searchColumn, searchText],
    queryFn: () =>
      searchModels(pageIndex, pageSize, sortField, sortOrder, {
        [searchColumn]: searchText
      } as SearchModelAdminRequest),
    placeholderData: keepPreviousData
  })

  const { list, total } = data?.data ?? {}
  const selectRowItem = list?.find((item) => item.id === selectedRowKey)

  const createModelMutation = useMutation({
    mutationFn: createModel,
    onSuccess: () => {
      message.success(t('modelCreated'))
      setCreateModalOpen(false)
      queryClient.invalidateQueries({ queryKey: ['models'] })
    }
  })

  const updateModelMutation = useMutation<
    Result<void>,
    Error,
    { id: string; data: UpdateModelAdminRequest }
  >({
    mutationFn: ({ id, data }) => updateModel(id, data),
    onSuccess: () => {
      message.success(t('modelUpdated'))
      setUpdateModalOpen(false)
      queryClient.invalidateQueries({ queryKey: ['models'] })
    }
  })

  const deleteModelMutation = useMutation({
    mutationFn: deleteModel,
    onSuccess: () => {
      message.success(t('modelDeleted'))
      setSelectedRowKey('')
      queryClient.invalidateQueries({ queryKey: ['models'] })
    }
  })

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: DataIndex
  ) => {
    confirm()
    setSearchColumn(dataIndex)
    setSearchText(selectedKeys[0])
  }

  const getColumnSearchProps = (dataIndex: DataIndex): TableColumnType<ModelAdminResponse> => ({
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
  ): TableColumnType<ModelAdminResponse> => ({
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

  const columns: TableProps<ModelAdminResponse>['columns'] = [
    {
      title: t('id'),
      dataIndex: 'id',
      ellipsis: true,
      sorter: true,
      ...getColumnSearchProps('id')
    },
    {
      title: t('avatar'),
      dataIndex: 'avatarPath',
      render: (avatarPath) => (
        <Avatar
          src={'http://localhost:9000' + avatarPath}
          icon={<StarOutlined />}
          draggable={false}
          className="select-none"
        />
      )
    },
    {
      title: t('name'),
      dataIndex: 'name',
      sorter: true,
      ...getColumnSearchProps('name')
    },
    {
      title: t('grade'),
      dataIndex: 'grade',
      ellipsis: true,
      sorter: true,
      ...getColumnFilterProps('grade', [
        { text: t('fourStar'), value: 4 },
        { text: t('fiveStar'), value: 5 }
      ])
    },
    {
      title: t('price'),
      dataIndex: 'price',
      ellipsis: true,
      sorter: true,
      ...getColumnSearchProps('price')
    },
    {
      title: t('path'),
      dataIndex: 'path',
      ellipsis: true,
      sorter: true,
      ...getColumnSearchProps('path')
    },
    {
      title: t('onSaleFlag'),
      dataIndex: 'onSaleFlag',
      ...getColumnFilterProps('onSaleFlag', [
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
              setAvatarPath('')
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
              deleteModelMutation.mutate(selectedRowKey)
            }}
          />
        </Tooltip>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-style">
        <Table<ModelAdminResponse>
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
            const s = sorter as SorterResult<ModelAdminResponse>
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
              createModelMutation.mutate({
                ...values,
                avatarPath: avatarPath || undefined,
                onSaleFlag: values.onSaleFlag ?? false
              })
            }}
          >
            <Form.Item name="name" label={t('name')} rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="grade" label={t('grade')} initialValue={4} rules={[{ required: true }]}>
              <InputNumber min={4} max={5} className="w-full" />
            </Form.Item>
            <Form.Item name="price" label={t('price')} initialValue={0} rules={[{ required: true }]}>
              <InputNumber min={0} className="w-full" />
            </Form.Item>
            <Form.Item name="path" label={t('path')} rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item
              name="onSaleFlag"
              label={t('onSaleFlag')}
              initialValue={false}
              valuePropName="checked"
            >
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
              onSaleFlag: selectRowItem?.onSaleFlag ?? false
            }}
            onFinish={async (values) => {
              updateModelMutation.mutate({
                id: selectedRowKey,
                data: {
                  ...values,
                  avatarPath: avatarPath || undefined,
                  onSaleFlag: values.onSaleFlag ?? false,
                  version: selectRowItem?.version
                }
              })
            }}
          >
            <Form.Item name="name" label={t('name')} rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="grade" label={t('grade')} rules={[{ required: true }]}>
              <InputNumber min={4} max={5} className="w-full" />
            </Form.Item>
            <Form.Item name="price" label={t('price')} rules={[{ required: true }]}>
              <InputNumber min={0} className="w-full" />
            </Form.Item>
            <Form.Item name="path" label={t('path')} rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="onSaleFlag" label={t('onSaleFlag')} valuePropName="checked">
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
