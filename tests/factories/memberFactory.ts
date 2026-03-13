// ============================================
// MEMBER DATA FACTORY
// ============================================
import { MemberSearchCriteria, MemberDetails } from '../types';
import { TEST_DATA_VALUES, TEST_MEMBER } from '../constants';

/**
 * Generates unique member IDs using timestamp
 */
export function generateUniqueMemberId(): string {
    return `TEST${Date.now()}`;
}

/**
 * Generates unique SSN using timestamp
 */
export function generateUniqueSSN(): string {
    const timestamp = Date.now().toString();
    return timestamp.slice(-9);
}

/**
 * Generates unique email address
 */
export function generateUniqueEmail(prefix: string = 'test'): string {
    return `${prefix}_${Date.now()}@telligen.com`;
}

/**
 * Creates a complete MemberDetails object with unique values
 * @param overrides - Optional fields to override defaults
 * @returns Complete MemberDetails object ready for member creation
 */
export function createMemberDetails(overrides?: Partial<MemberDetails>): MemberDetails {
    const timestamp = Date.now();

    return {
        firstName: `TestFirst_${timestamp}`,
        lastName: `TestLast_${timestamp}`,
        birthDate: '01012000',
        gender: TEST_DATA_VALUES.GENDER_MALE,
        ssn: generateUniqueSSN(),
        memberId: generateUniqueMemberId(),
        address: TEST_DATA_VALUES.TEST_ADDRESS,
        city: TEST_DATA_VALUES.TEST_CITY,
        state: TEST_DATA_VALUES.TEST_STATE,
        zip: TEST_DATA_VALUES.TEST_ZIP,
        client: TEST_MEMBER.CLIENT,
        ...overrides
    };
}

/**
 * Creates MemberSearchCriteria for the standard test member
 * @param overrides - Optional fields to override defaults
 * @returns MemberSearchCriteria object
 */
export function createStandardMemberSearch(overrides?: Partial<MemberSearchCriteria>): MemberSearchCriteria {
    return {
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
        ...overrides
    };
}

/**
 * Creates minimal MemberSearchCriteria with only required fields
 * @param memberId - Member ID to search for
 * @param client - Client name
 * @returns Minimal search criteria
 */
export function createMinimalMemberSearch(memberId: string, client: string = TEST_MEMBER.CLIENT): MemberSearchCriteria {
    return {
        client,
        memberId
    };
}

/**
 * Creates MemberSearchCriteria for searching by name
 * @param firstName - First name
 * @param lastName - Last name
 * @param client - Client name
 * @returns Search criteria by name
 */
export function createNameBasedSearch(firstName: string, lastName: string, client: string = TEST_MEMBER.CLIENT): MemberSearchCriteria {
    return {
        client,
        firstName,
        lastName
    };
}

/**
 * Creates a batch of unique member details for bulk testing
 * @param count - Number of member details to generate
 * @param baseOverrides - Optional base overrides applied to all members
 * @returns Array of MemberDetails objects
 */
export function createMemberBatch(count: number, baseOverrides?: Partial<MemberDetails>): MemberDetails[] {
    const members: MemberDetails[] = [];

    for (let i = 0; i < count; i++) {
        // Add delay to ensure unique timestamps
        const uniqueId = Date.now() + i;

        members.push(createMemberDetails({
            ...baseOverrides,
            firstName: `TestFirst_${uniqueId}`,
            lastName: `TestLast_${uniqueId}`,
            memberId: `TEST${uniqueId}`,
            ssn: uniqueId.toString().slice(-9)
        }));
    }

    return members;
}
