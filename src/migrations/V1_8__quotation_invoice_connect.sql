ALTER TABLE `quotation`
MODIFY `status` ENUM(
    'quotation.status.non_existent',
    'quotation.status.expired',
    'quotation.status.draft',
    'quotation.status.validated',
    'quotation.status.sent',
    'quotation.status.accepted',
    'quotation.status.rejected',
    'quotation.status.invoiced',
    'quotation.status.archived'
) DEFAULT NULL;