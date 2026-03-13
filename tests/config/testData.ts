import { MemberSearchCriteria } from '../types';
import { TEST_MEMBER, TEST_CREDENTIALS } from '../constants';

/**
 * @deprecated Use constants from '../constants' and interfaces from '../types' instead
 * This file is kept for backwards compatibility but will be removed in Phase 3
 */
export const TEST_DATA = {
    credentials: {
        username: TEST_CREDENTIALS.STAGE_USERNAME,
        password: TEST_CREDENTIALS.STAGE_PASSWORD
    },
    testMember: {
        id: TEST_MEMBER.ID,
        fullId: TEST_MEMBER.FULL_ID,
        client: TEST_MEMBER.CLIENT,
        ssn: TEST_MEMBER.SSN,
        fullSsn: TEST_MEMBER.FULL_SSN,
        firstName: TEST_MEMBER.FIRST_NAME,
        lastName: TEST_MEMBER.LAST_NAME,
        dob: TEST_MEMBER.DOB,
        phone: TEST_MEMBER.PHONE,
        email: TEST_MEMBER.EMAIL,
        relationship: TEST_MEMBER.RELATIONSHIP,
        gender: TEST_MEMBER.GENDER,
    }
};

/**
 * Pre-configured search criteria for the standard test member
 */
export const STANDARD_MEMBER_SEARCH: MemberSearchCriteria = {
    client: TEST_MEMBER.CLIENT,
    memberId: TEST_MEMBER.ID,
    lastName: TEST_MEMBER.LAST_NAME,
    firstName: TEST_MEMBER.FIRST_NAME,
    dob: TEST_MEMBER.DOB,
    phoneNumber: TEST_MEMBER.PHONE,
    email: TEST_MEMBER.EMAIL,
    relationshipStatus: TEST_MEMBER.RELATIONSHIP,
    gender: TEST_MEMBER.GENDER,
    ssn: TEST_MEMBER.SSN,
};