import { useEffect, useRef, useState } from 'react'
import ConfirmDialog from '../AccountModals/ConfirmDialog'
import { ChevronRightIcon, EditIcon, PlusIcon, SearchIcon, ShieldCheckIcon, TrashIcon, UserIcon } from '../icons/Icons'
import SectionCard from '../SectionCard/SectionCard'
import styles from './AuthorizedSignatorySection.module.css'

export type SignatoryMember = {
  id: string
  customerNo: string
  customerName: string
  mandatory: boolean
  signatureCount: number
}

export type SignatoryGroup = {
  id: string
  groupId: string
  requiredSignatures: string
  members: SignatoryMember[]
}

export const defaultSignatoryGroups: SignatoryGroup[] = [
  {
    id: 'grp-1',
    groupId: 'G001',
    requiredSignatures: '1',
    members: [
      { id: 'mem-1', customerNo: '000001207', customerName: 'RMR', mandatory: true, signatureCount: 2 },
    ],
  },
]

type AuthorizedSignatorySectionProps = {
  groups: SignatoryGroup[]
  editable: boolean
  onAddGroup: () => void
  onDeleteGroup: (groupId: string) => void
  onGroupFieldChange: (groupId: string, field: 'groupId' | 'requiredSignatures', value: string) => void
  onAddMember: (groupId: string) => void
  onDeleteMember: (groupId: string, memberId: string) => void
  onMemberFieldChange: <Field extends keyof SignatoryMember>(
    groupId: string,
    memberId: string,
    field: Field,
    value: SignatoryMember[Field],
  ) => void
  onSelectSignature: (groupId: string, memberId: string, fileNames: string[]) => void
}

const glassTonePalette = ['blue', 'lavender', 'mint', 'cyan', 'peach'] as const

const getGlassTone = (id: string) => {
  let hash = 0
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0
  }
  return glassTonePalette[hash % glassTonePalette.length]
}

const AuthorizedSignatorySection = ({
  groups,
  editable,
  onAddGroup,
  onDeleteGroup,
  onGroupFieldChange,
  onAddMember,
  onDeleteMember,
  onMemberFieldChange,
  onSelectSignature,
}: AuthorizedSignatorySectionProps) => {
  const [collapsedIds, setCollapsedIds] = useState<string[]>([])
  const [deleteGroupId, setDeleteGroupId] = useState<string | null>(null)
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({})
  const fileInputRefs = useRef<Map<string, HTMLInputElement>>(new Map())

  const toggleCollapsed = (id: string) => {
    setCollapsedIds((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  useEffect(() => {
    return () => {
      Object.values(previewUrls).forEach((url) => URL.revokeObjectURL(url))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSelectClick = (memberId: string) => {
    fileInputRefs.current.get(memberId)?.click()
  }

  const handleFilesChosen = (groupId: string, memberId: string, fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return
    const files = Array.from(fileList)
    const imageFile = files.find((file) => file.type.startsWith('image/'))
    if (imageFile) {
      const url = URL.createObjectURL(imageFile)
      setPreviewUrls((prev) => {
        const existing = prev[memberId]
        if (existing) URL.revokeObjectURL(existing)
        return { ...prev, [memberId]: url }
      })
    }
    onSelectSignature(groupId, memberId, files.map((file) => file.name))
  }

  const handleDeleteMember = (groupId: string, memberId: string) => {
    setPreviewUrls((prev) => {
      const existing = prev[memberId]
      if (!existing) return prev
      URL.revokeObjectURL(existing)
      return Object.fromEntries(Object.entries(prev).filter(([id]) => id !== memberId))
    })
    onDeleteMember(groupId, memberId)
  }

  const deleteTargetGroup = deleteGroupId ? groups.find((group) => group.id === deleteGroupId) : undefined

  return (
    <SectionCard
      icon={<ShieldCheckIcon />}
      title="Signatory Groups"
      subtitle="Define approval groups and required signatures for this account."
      tone="teal"
      reveal
      action={
        <button
          type="button"
          className={`${styles.addGroupButton} ${!editable ? styles.disabledButton : ''}`}
          disabled={!editable}
          title={editable ? undefined : 'Click Edit to make changes'}
          onClick={onAddGroup}
        >
          <PlusIcon className={styles.addGroupIcon} />
          Add Signatory Group
        </button>
      }
    >
      {groups.length === 0 ? (
        <div className={styles.emptyState}>
          <ShieldCheckIcon className={styles.emptyIcon} />
          <p className={styles.emptyTitle}>No signatory groups configured</p>
          <p className={styles.emptyDesc}>Click Add Signatory Group to get started.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {groups.map((group) => {
            const isCollapsed = collapsedIds.includes(group.id)
            const requiredCount = Number(group.requiredSignatures) || 0
            const tone = styles[`tone_${getGlassTone(group.id)}`]

            return (
              <div key={group.id} className={`${styles.groupCard} ${tone}`}>
                <button
                  type="button"
                  className={styles.cardHeader}
                  onClick={() => toggleCollapsed(group.id)}
                  aria-label={isCollapsed ? 'Expand group' : 'Collapse group'}
                >
                  <span className={styles.groupIconWrap}>
                    <ShieldCheckIcon className={styles.groupIcon} />
                  </span>
                  <span className={styles.headerText}>
                    <span className={styles.groupTitle}>{group.groupId}</span>
                    <span className={styles.groupMeta}>
                      {group.members.length} Member{group.members.length === 1 ? '' : 's'} &middot; {requiredCount} Required
                    </span>
                  </span>
                  <ChevronRightIcon className={`${styles.collapseIcon} ${isCollapsed ? '' : styles.collapseIconOpen}`} />
                </button>

                {!isCollapsed && (
                  <div className={styles.cardBody}>
                    <div className={styles.groupFields}>
                      <label className={styles.field}>
                        <span>Group ID</span>
                        <input
                          value={group.groupId}
                          disabled={!editable}
                          onChange={(event) => onGroupFieldChange(group.id, 'groupId', event.target.value)}
                        />
                      </label>
                      <label className={styles.field}>
                        <span>Required Signatures</span>
                        <input
                          className={styles.requiredInput}
                          value={group.requiredSignatures}
                          disabled={!editable}
                          onChange={(event) => onGroupFieldChange(group.id, 'requiredSignatures', event.target.value)}
                        />
                      </label>
                    </div>

                    <div className={styles.memberList}>
                      {group.members.map((member) => (
                        <div key={member.id} className={styles.memberBlock}>
                          <div className={styles.memberMain}>
                            <div className={styles.memberInfoRow}>
                              <label className={styles.memberField}>
                                <span className={styles.miniLabel}>Customer No</span>
                                <span className={styles.memberControlWrap}>
                                  <input
                                    value={member.customerNo}
                                    disabled={!editable}
                                    onChange={(event) => onMemberFieldChange(group.id, member.id, 'customerNo', event.target.value)}
                                  />
                                  <SearchIcon className={styles.memberSuffixIcon} />
                                </span>
                              </label>
                              <label className={styles.memberField}>
                                <span className={styles.miniLabel}>Customer Name</span>
                                <input
                                  value={member.customerName}
                                  disabled={!editable}
                                  onChange={(event) => onMemberFieldChange(group.id, member.id, 'customerName', event.target.value)}
                                />
                              </label>
                              <button
                                type="button"
                                className={styles.memberDeleteButton}
                                disabled={!editable}
                                title={editable ? 'Remove member' : 'Click Edit to make changes'}
                                onClick={() => handleDeleteMember(group.id, member.id)}
                              >
                                <TrashIcon className={styles.memberDeleteIcon} />
                              </button>
                            </div>

                            <div className={styles.memberActionRow}>
                              <label className={styles.mandatoryLabel}>
                                <input
                                  type="checkbox"
                                  className={styles.checkbox}
                                  checked={member.mandatory}
                                  disabled={!editable}
                                  onChange={(event) => onMemberFieldChange(group.id, member.id, 'mandatory', event.target.checked)}
                                />
                                Mandatory
                              </label>

                              <button
                                type="button"
                                className={styles.signatureButton}
                                disabled={!editable}
                                title={editable ? undefined : 'Click Edit to make changes'}
                                onClick={() => handleSelectClick(member.id)}
                              >
                                <EditIcon className={styles.signatureIcon} />
                                Select ({member.signatureCount})
                              </button>
                              <input
                                ref={(el) => {
                                  if (el) fileInputRefs.current.set(member.id, el)
                                  else fileInputRefs.current.delete(member.id)
                                }}
                                type="file"
                                accept="image/*,.pdf"
                                multiple
                                className={styles.hiddenFileInput}
                                onChange={(event) => {
                                  handleFilesChosen(group.id, member.id, event.target.files)
                                  event.target.value = ''
                                }}
                              />
                            </div>
                          </div>

                          <span className={styles.memberPreview} aria-hidden="true">
                            {previewUrls[member.id] ? (
                              <img src={previewUrls[member.id]} alt="" className={styles.memberPreviewImage} />
                            ) : (
                              <UserIcon className={styles.memberPreviewIcon} />
                            )}
                          </span>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      className={`${styles.addHolderButton} ${!editable ? styles.disabledButton : ''}`}
                      disabled={!editable}
                      title={editable ? undefined : 'Click Edit to make changes'}
                      onClick={() => onAddMember(group.id)}
                    >
                      <PlusIcon className={styles.addHolderIcon} />
                      Add Holder
                    </button>
                  </div>
                )}

                {!isCollapsed && (
                  <div className={styles.cardFooter}>
                    <button type="button" className={styles.editGroupButton} onClick={() => toggleCollapsed(group.id)}>
                      <EditIcon className={styles.footerIcon} />
                      Edit Group
                    </button>
                    <button
                      type="button"
                      className={styles.deleteGroupButton}
                      disabled={!editable}
                      title={editable ? undefined : 'Click Edit to make changes'}
                      onClick={() => setDeleteGroupId(group.id)}
                    >
                      <TrashIcon className={styles.footerIcon} />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {deleteTargetGroup && (
        <ConfirmDialog
          title="Delete Signatory Group?"
          message={`Are you sure you want to delete group ${deleteTargetGroup.groupId}?`}
          confirmLabel="Delete"
          onCancel={() => setDeleteGroupId(null)}
          onConfirm={() => {
            onDeleteGroup(deleteTargetGroup.id)
            setDeleteGroupId(null)
          }}
        />
      )}
    </SectionCard>
  )
}

export default AuthorizedSignatorySection
